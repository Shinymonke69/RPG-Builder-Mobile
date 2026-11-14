import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { CustomCard } from '../../components/CustomCard';
import { CustomButton } from '../../components/CustomButton';
import { characterStorage } from '../../services/storage';
import { signOut } from '../../features/auth';
import { Character } from '../../types/character';

export default function HomeScreen() {
  const router = useRouter();
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [lastCharacter, setLastCharacter] = useState<Character | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    const list = await characterStorage.getAll();
    setCharacterCount(list.length);
    setLastCharacter(list.length > 0 ? list[0] : null);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryLight}
          />
        }
      >
        <View style={styles.heroSection}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.badge}>
              <Ionicons name="sparkles" size={14} color={colors.accent} />
              <Text style={styles.badgeText}>D&D 5ª Edição</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={async () => {
                await signOut();
                router.replace('/(auth)/sign-in');
              }}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.danger} />
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroTitle}>RPG Builder Mobile</Text>
          <Text style={styles.heroDescription}>
            Crie, personalize e gerencie fichas de personagens de D&D 5e em qualquer lugar.
          </Text>
        </View>

        <CustomCard variant="highlight" style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statsLabel}>Total de Fichas</Text>
              <Text style={styles.statsValue}>{characterCount}</Text>
            </View>
            <View style={styles.statsIconBox}>
              <Ionicons name="shield-checkmark" size={32} color={colors.primaryLight} />
            </View>
          </View>
        </CustomCard>

        <Text style={styles.sectionTitle}>Ações Rápidas</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/quick-roll')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#FF8A0022' }]}>
              <Ionicons name="dice" size={28} color={colors.secondary} />
            </View>
            <Text style={styles.actionCardTitle}>Gerador 1-Clique</Text>
            <Text style={styles.actionCardDesc}>
              Sorteie atributos, raça e classe instantaneamente.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/create')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#8A2BE222' }]}>
              <Ionicons name="create" size={28} color={colors.primaryLight} />
            </View>
            <Text style={styles.actionCardTitle}>Criação Manual</Text>
            <Text style={styles.actionCardDesc}>
              Defina cada detalhe, nome, valores e história.
            </Text>
          </TouchableOpacity>
        </View>

        {lastCharacter && (
          <>
            <Text style={styles.sectionTitle}>Última Ficha Criada</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(`/character/${lastCharacter.id}`)}
            >
              <CustomCard style={{ marginBottom: 8 }}>
                <View style={styles.lastCharRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.lastCharName}>{lastCharacter.name}</Text>
                    <Text style={styles.lastCharMeta}>
                      {lastCharacter.raceName} • {lastCharacter.className} (Nív. {lastCharacter.level})
                    </Text>
                  </View>
                  <View style={styles.viewButton}>
                    <Ionicons name="chevron-forward" size={22} color={colors.primaryLight} />
                  </View>
                </View>
              </CustomCard>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Ver Todas as Fichas"
            variant="outline"
            icon={<Ionicons name="list" size={18} color={colors.textSecondary} />}
            onPress={() => router.push('/(tabs)/characters')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    padding: 20
  },
  heroSection: {
    marginBottom: 20
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#EF444415'
  },
  logoutText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.cardSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    marginLeft: 6
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.5
  },
  heroDescription: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 20
  },
  statsCard: {
    marginBottom: 24
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  statsLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600'
  },
  statsValue: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    marginTop: 4
  },
  statsIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6
  },
  actionCardDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16
  },
  lastCharRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  lastCharName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text
  },
  lastCharMeta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4
  },
  viewButton: {
    padding: 8
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20
  }
});
