import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { CustomHeader } from '../../components/CustomHeader';
import { CustomCard } from '../../components/CustomCard';
import { CustomButton } from '../../components/CustomButton';
import { AttributeBadge } from '../../components/AttributeBadge';
import { generateRandomCharacter } from '../../services/diceRoller';
import { characterStorage } from '../../services/storage';
import { Character } from '../../types/character';

export default function QuickRollScreen() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [rolling, setRolling] = useState<boolean>(false);
  const [savedSuccessName, setSavedSuccessName] = useState<string | null>(null);

  const handleRoll = () => {
    setSavedSuccessName(null);
    setRolling(true);
    setTimeout(() => {
      const generated = generateRandomCharacter();
      setCharacter(generated);
      setRolling(false);
    }, 250);
  };

  const handleSave = async () => {
    if (!character) return;
    setSaving(true);
    const success = await characterStorage.save(character);
    setSaving(false);

    if (success) {
      setSavedSuccessName(character.name);
      Alert.alert(
        'Sucesso!',
        `A ficha de "${character.name}" foi salva com sucesso no seu Grimório!`,
        [
          { text: 'Gerar Outro', onPress: () => handleRoll() },
          { text: 'Ver no Grimório', onPress: () => router.push('/(tabs)/characters') }
        ]
      );
    } else {
      Alert.alert('Erro', 'Não foi possível salvar o personagem.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Gerador Aleatório"
        subtitle="Sorteio automático D&D 5e: raça, classe, histórico e 4d6"
      />
      <ScrollView contentContainerStyle={styles.container}>
        {savedSuccessName && (
          <View style={styles.savedBanner}>
            <Ionicons name="shield-checkmark" size={22} color={colors.success} />
            <Text style={styles.savedBannerText}>
              Ficha de "{savedSuccessName}" salva com sucesso!
            </Text>
          </View>
        )}
        <View style={styles.rollActionBox}>
          <CustomButton
            title={character ? 'Rolar Nova Ficha' : 'Sortear Personagem (1-Clique)'}
            variant="secondary"
            loading={rolling}
            icon={<Ionicons name="dice" size={24} color={colors.text} />}
            onPress={handleRoll}
          />
        </View>

        {character ? (
          <>
            <CustomCard variant="highlight">
              <View style={styles.headerCard}>
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={32} color={colors.primaryLight} />
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.charName}>{character.name}</Text>
                  <Text style={styles.charDetails}>
                    {character.raceName} • {character.className}
                  </Text>
                  <Text style={styles.charBg}>
                    Antecedente: {character.backgroundName}
                  </Text>
                </View>
              </View>

              <View style={styles.vitalStatsRow}>
                <View style={styles.vitalStatItem}>
                  <Text style={styles.vitalStatLabel}>Pontos de Vida</Text>
                  <Text style={[styles.vitalStatValue, { color: colors.badgeHp }]}>
                    {character.maxHp} HP
                  </Text>
                </View>
                <View style={styles.vitalDivider} />
                <View style={styles.vitalStatItem}>
                  <Text style={styles.vitalStatLabel}>Classe Armadura</Text>
                  <Text style={[styles.vitalStatValue, { color: colors.badgeAc }]}>
                    {character.armorClass} CA
                  </Text>
                </View>
                <View style={styles.vitalDivider} />
                <View style={styles.vitalStatItem}>
                  <Text style={styles.vitalStatLabel}>Deslocamento</Text>
                  <Text style={[styles.vitalStatValue, { color: colors.badgeSpeed }]}>
                    {character.speed} ft
                  </Text>
                </View>
              </View>
            </CustomCard>

            <CustomCard>
              <Text style={styles.subTitle}>Atributos Principais (4d6 drop lowest)</Text>
              <View style={styles.attributesRow}>
                <AttributeBadge label="FOR" score={character.strength} />
                <AttributeBadge label="DES" score={character.dexterity} />
                <AttributeBadge label="CON" score={character.constitution} />
                <AttributeBadge label="INT" score={character.intelligence} />
                <AttributeBadge label="SAB" score={character.wisdom} />
                <AttributeBadge label="CAR" score={character.charisma} />
              </View>
            </CustomCard>

            <View style={styles.footerButtons}>
              <CustomButton
                title="Salvar Esta Ficha"
                loading={saving}
                icon={<Ionicons name="save" size={20} color={colors.text} />}
                onPress={handleSave}
                style={styles.saveBtn}
              />
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.diceIconLarge}>
              <Ionicons name="dice-outline" size={72} color={colors.cardBorder} />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma ficha rolada ainda</Text>
            <Text style={styles.emptySubtitle}>
              Toque no botão acima para rolar atributos completos, raça e classe com as regras oficiais de D&D 5e.
            </Text>
          </View>
        )}
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
    padding: 16
  },
  savedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98122',
    borderWidth: 1.5,
    borderColor: colors.success,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  savedBannerText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
    flex: 1
  },
  rollActionBox: {
    marginBottom: 20
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  headerInfo: {
    flex: 1
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
    marginTop: 2
  },
  charBg: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2
  },
  vitalStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  vitalStatItem: {
    alignItems: 'center',
    flex: 1
  },
  vitalDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border
  },
  vitalStatLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600'
  },
  vitalStatValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 14
  },
  attributesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerButtons: {
    marginTop: 10,
    marginBottom: 24
  },
  saveBtn: {
    backgroundColor: colors.primary
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24
  },
  diceIconLarge: {
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20
  }
});
