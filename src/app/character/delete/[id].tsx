import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';
import { CustomHeader } from '../../../components/CustomHeader';
import { CustomCard } from '../../../components/CustomCard';
import { CustomButton } from '../../../components/CustomButton';
import { characterStorage } from '../../../services/storage';
import { Character } from '../../../types/character';

export default function DeleteCharacterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      if (id) {
        const found = await characterStorage.getById(id);
        setCharacter(found);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleConfirmDelete = async () => {
    if (!character) return;
    setDeleting(true);
    await characterStorage.delete(character.id);
    setDeleting(false);
    router.replace('/(tabs)/characters');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader title="Excluir Ficha" showBack onBack={() => router.back()} />
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primaryLight} />
        </View>
      </SafeAreaView>
    );
  }

  if (!character) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader title="Ficha Não Encontrada" showBack onBack={() => router.back()} />
        <View style={styles.centerBox}>
          <Ionicons name="alert-circle-outline" size={56} color={colors.textMuted} />
          <Text style={styles.notFoundText}>Esta ficha não existe ou já foi excluída.</Text>
          <CustomButton
            title="Voltar"
            variant="outline"
            onPress={() => router.back()}
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Excluir Personagem"
        showBack
        onBack={() => router.back()}
      />

      <View style={styles.container}>
        <View style={styles.warningIconBox}>
          <Ionicons name="trash" size={48} color={colors.danger} />
        </View>

        <Text style={styles.warningTitle}>Confirmar Exclusão</Text>
        <Text style={styles.warningDescription}>
          Tem certeza de que deseja apagar permanentemente esta ficha? Esta ação não pode ser desfeita.
        </Text>

        <CustomCard style={styles.charSummaryCard}>
          <Text style={styles.charName}>{character.name}</Text>
          <Text style={styles.charDetails}>
            {character.raceName} • {character.className} (Nível {character.level})
          </Text>
          <View style={styles.statsPillsRow}>
            <Text style={styles.pillText}>HP: {character.maxHp}</Text>
            <Text style={styles.pillText}>CA: {character.armorClass}</Text>
            <Text style={styles.pillText}>FOR: {character.strength}</Text>
          </View>
        </CustomCard>

        <View style={styles.actionsContainer}>
          <CustomButton
            title="Sim, Excluir Definitivamente"
            variant="danger"
            loading={deleting}
            icon={<Ionicons name="trash" size={20} color={colors.text} />}
            onPress={handleConfirmDelete}
            style={styles.deleteBtn}
          />

          <CustomButton
            title="Cancelar e Manter Ficha"
            variant="outline"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  warningIconBox: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EF444415',
    borderWidth: 2,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8
  },
  warningDescription: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 12
  },
  charSummaryCard: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 28,
    borderColor: '#EF444444'
  },
  charName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text
  },
  charDetails: {
    fontSize: 14,
    color: colors.secondaryLight,
    fontWeight: '600',
    marginTop: 4
  },
  statsPillsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12
  },
  pillText: {
    fontSize: 12,
    color: colors.textMuted,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '700'
  },
  actionsContainer: {
    width: '100%'
  },
  deleteBtn: {
    marginBottom: 12
  },
  notFoundText: {
    color: colors.textMuted,
    fontSize: 16,
    marginTop: 12
  }
});
