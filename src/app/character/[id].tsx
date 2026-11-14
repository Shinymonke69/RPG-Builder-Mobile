import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { CustomHeader } from '../../components/CustomHeader';
import { CustomCard } from '../../components/CustomCard';
import { CustomButton } from '../../components/CustomButton';
import { AttributeBadge } from '../../components/AttributeBadge';
import { characterStorage } from '../../services/storage';
import { Character } from '../../types/character';
import { rollD20, calculateModifier, formatModifier } from '../../services/diceRoller';

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastCheckResult, setLastCheckResult] = useState<string | null>(null);

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

  const handleRollTest = (attrName: string, score: number) => {
    const d20 = rollD20();
    const mod = calculateModifier(score);
    const total = d20 + mod;
    setLastCheckResult(`Teste de ${attrName}: d20 (${d20}) ${formatModifier(mod)} = ${total}`);
  };

  const handleDelete = () => {
    if (!character) return;
    router.push(`/character/delete/${character.id}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader title="Ficha do Personagem" showBack onBack={() => router.back()} />
        <View style={styles.centerBox}>
          <Text style={styles.loadingText}>Carregando dados da ficha...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!character) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader title="Ficha Não Encontrada" showBack onBack={() => router.back()} />
        <View style={styles.centerBox}>
          <Ionicons name="lock-closed-outline" size={56} color={colors.danger} />
          <Text style={[styles.loadingText, { color: colors.danger, marginTop: 12, fontWeight: '700' }]}>
            Acesso Não Autorizado
          </Text>
          <Text style={[styles.loadingText, { textAlign: 'center', marginHorizontal: 24, marginTop: 6 }]}>
            Esta ficha não pertence à sua conta ou foi excluída.
          </Text>
          <CustomButton
            title="Voltar para Minhas Fichas"
            variant="outline"
            onPress={() => router.replace('/(tabs)/characters')}
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title={character.name}
        subtitle={`${character.raceName} • ${character.className} (Nível ${character.level})`}
        showBack
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity onPress={handleDelete} style={styles.headerDeleteBtn}>
            <Ionicons name="trash-outline" size={22} color={colors.danger} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.container}>
        <CustomCard variant="highlight">
          <View style={styles.vitalsRow}>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>HP Máximo</Text>
              <Text style={[styles.vitalValue, { color: colors.badgeHp }]}>
                {character.maxHp}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>Classe Armadura</Text>
              <Text style={[styles.vitalValue, { color: colors.badgeAc }]}>
                {character.armorClass}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>Iniciativa</Text>
              <Text style={[styles.vitalValue, { color: colors.accent }]}>
                {formatModifier(character.initiative)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>Deslocamento</Text>
              <Text style={[styles.vitalValue, { color: colors.badgeSpeed }]}>
                {character.speed} ft
              </Text>
            </View>
          </View>
        </CustomCard>

        <CustomCard>
          <Text style={styles.sectionHeading}>Atributos Principais</Text>
          <View style={styles.attributesGrid}>
            <TouchableOpacity onPress={() => handleRollTest('Força', character.strength)}>
              <AttributeBadge label="FOR" score={character.strength} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRollTest('Destreza', character.dexterity)}>
              <AttributeBadge label="DES" score={character.dexterity} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRollTest('Constituição', character.constitution)}>
              <AttributeBadge label="CON" score={character.constitution} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRollTest('Inteligência', character.intelligence)}>
              <AttributeBadge label="INT" score={character.intelligence} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRollTest('Sabedoria', character.wisdom)}>
              <AttributeBadge label="SAB" score={character.wisdom} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRollTest('Carisma', character.charisma)}>
              <AttributeBadge label="CAR" score={character.charisma} />
            </TouchableOpacity>
          </View>
          <Text style={styles.tapTip}>* Toque em um atributo para rolar um teste (d20 + mod)</Text>
        </CustomCard>

        {lastCheckResult && (
          <View style={styles.rollResultBox}>
            <Ionicons name="dice" size={20} color={colors.secondary} />
            <Text style={styles.rollResultText}>{lastCheckResult}</Text>
          </View>
        )}

        <CustomCard>
          <Text style={styles.sectionHeading}>Detalhes de Campanha</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Antecedente:</Text>
            <Text style={styles.detailValue}>{character.backgroundName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Experiência (XP):</Text>
            <Text style={styles.detailValue}>{character.xp} XP</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Status da Ficha:</Text>
            <Text style={[styles.detailValue, { color: colors.success }]}>
              {character.status}
            </Text>
          </View>
        </CustomCard>

        {character.story && (
          <CustomCard>
            <Text style={styles.sectionHeading}>História & Anotações</Text>
            <Text style={styles.storyText}>{character.story}</Text>
          </CustomCard>
        )}

        <View style={styles.backButtonBox}>
          <CustomButton
            title="Voltar para Lista"
            variant="outline"
            onPress={() => router.back()}
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
    padding: 16
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 16
  },
  headerDeleteBtn: {
    padding: 6
  },
  vitalsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  vitalBox: {
    alignItems: 'center',
    flex: 1
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.cardBorder
  },
  vitalLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase'
  },
  vitalValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryLight,
    marginBottom: 12
  },
  attributesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tapTip: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 10,
    textAlign: 'center'
  },
  rollResultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardSecondary,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  rollResultText: {
    marginLeft: 8,
    color: colors.text,
    fontWeight: '700',
    fontSize: 14
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder
  },
  detailTitle: {
    color: colors.textSecondary,
    fontSize: 14
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600'
  },
  storyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22
  },
  backButtonBox: {
    marginTop: 8,
    marginBottom: 24
  }
});
