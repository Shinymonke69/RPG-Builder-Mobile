import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  RefreshControl
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { CustomHeader } from '../../components/CustomHeader';
import { CustomCard } from '../../components/CustomCard';
import { characterStorage } from '../../services/storage';
import { Character } from '../../types/character';

export default function CharactersScreen() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchCharacters = async () => {
    const list = await characterStorage.getAll();
    setCharacters(list);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchCharacters();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCharacters();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    router.push(`/character/delete/${id}`);
  };

  const renderCharacterCard = ({ item }: { item: Character }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/character/${item.id}`)}
      >
        <CustomCard style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.charName}>{item.name}</Text>
              <Text style={styles.charSubtitle}>
                {item.raceName} • {item.className} (Nível {item.level})
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="trash-outline" size={22} color={colors.danger} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsSummary}>
            <View style={styles.statPill}>
              <Text style={styles.statPillLabel}>HP</Text>
              <Text style={[styles.statPillValue, { color: colors.badgeHp }]}>
                {item.maxHp}
              </Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillLabel}>CA</Text>
              <Text style={[styles.statPillValue, { color: colors.badgeAc }]}>
                {item.armorClass}
              </Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillLabel}>FOR</Text>
              <Text style={styles.statPillValue}>{item.strength}</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillLabel}>DES</Text>
              <Text style={styles.statPillValue}>{item.dexterity}</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillLabel}>CON</Text>
              <Text style={styles.statPillValue}>{item.constitution}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.bgText}>Antecedente: {item.backgroundName}</Text>
            <View style={styles.viewDetailsRow}>
              <Text style={styles.viewDetailsText}>Ver Ficha</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.primaryLight} />
            </View>
          </View>
        </CustomCard>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Fichas Salvas"
        subtitle={`${characters.length} personagem(ns) no Grimório`}
        rightAction={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/(tabs)/create')}
          >
            <Ionicons name="add" size={24} color={colors.text} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={characters}
        keyExtractor={(item) => item.id}
        renderItem={renderCharacterCard}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryLight}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="shield-outline" size={64} color={colors.cardBorder} />
              <Text style={styles.emptyTitle}>Nenhuma ficha salva</Text>
              <Text style={styles.emptySubtitle}>
                Crie um personagem manual ou use o gerador de 1-clique para povoar suas aventuras!
              </Text>
            </View>
          ) : undefined
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24
  },
  card: {
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  headerLeft: {
    flex: 1
  },
  charName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text
  },
  charSubtitle: {
    fontSize: 13,
    color: colors.secondaryLight,
    fontWeight: '600',
    marginTop: 2
  },
  deleteButton: {
    padding: 6
  },
  statsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  statPill: {
    alignItems: 'center'
  },
  statPillLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted
  },
  statPillValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12
  },
  bgText: {
    fontSize: 12,
    color: colors.textMuted
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewDetailsText: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '700',
    marginRight: 4
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 6
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20
  }
});
