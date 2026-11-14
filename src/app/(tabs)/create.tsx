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
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { CustomCard } from '../../components/CustomCard';
import {
  RACES,
  CLASSES,
  BACKGROUNDS,
  CLASS_HIT_DIE
} from '../../constants/rpgData';
import { calculateModifier } from '../../services/diceRoller';
import { characterStorage } from '../../services/storage';
import { Character, CharacterFormData } from '../../types/character';

export default function CreateCharacterScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState<CharacterFormData>({
    name: '',
    level: '1',
    className: CLASSES[0],
    raceName: RACES[0],
    backgroundName: BACKGROUNDS[0],
    strength: '10',
    dexterity: '10',
    constitution: '10',
    intelligence: '10',
    wisdom: '10',
    charisma: '10',
    story: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CharacterFormData, string>>>({});
  const [saving, setSaving] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleInputChange = (field: keyof CharacterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CharacterFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'O nome do personagem é obrigatório.';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'O nome deve ter no máximo 50 caracteres.';
    }

    const lvl = parseInt(formData.level, 10);
    if (isNaN(lvl) || lvl < 1 || lvl > 20) {
      newErrors.level = 'Nível deve ser entre 1 e 20.';
    }

    const validateAttr = (val: string, field: keyof CharacterFormData, name: string) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 1 || num > 30) {
        newErrors[field] = `${name} deve estar entre 1 e 30.`;
      }
    };

    validateAttr(formData.strength, 'strength', 'Força');
    validateAttr(formData.dexterity, 'dexterity', 'Destreza');
    validateAttr(formData.constitution, 'constitution', 'Constituição');
    validateAttr(formData.intelligence, 'intelligence', 'Inteligência');
    validateAttr(formData.wisdom, 'wisdom', 'Sabedoria');
    validateAttr(formData.charisma, 'charisma', 'Carisma');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      Alert.alert('Atenção', 'Por favor, corrija os erros no formulário antes de salvar.');
      return;
    }

    setSaving(true);

    const level = parseInt(formData.level, 10);
    const strength = parseInt(formData.strength, 10);
    const dexterity = parseInt(formData.dexterity, 10);
    const constitution = parseInt(formData.constitution, 10);
    const intelligence = parseInt(formData.intelligence, 10);
    const wisdom = parseInt(formData.wisdom, 10);
    const charisma = parseInt(formData.charisma, 10);

    const hitDie = CLASS_HIT_DIE[formData.className] || 8;
    const conMod = calculateModifier(constitution);
    const dexMod = calculateModifier(dexterity);
    const maxHp = Math.max(1, hitDie + conMod + (level - 1) * (Math.floor(hitDie / 2) + 1 + conMod));
    const armorClass = 10 + dexMod;
    const speed = ['Anão', 'Halfling', 'Gnomo'].includes(formData.raceName) ? 25 : 30;

    const newChar: Character = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      name: formData.name.trim(),
      level,
      xp: 0,
      currentHp: maxHp,
      maxHp,
      temporaryHp: 0,
      status: 'Ativo',
      className: formData.className,
      raceName: formData.raceName,
      backgroundName: formData.backgroundName,
      strength,
      dexterity,
      constitution,
      intelligence,
      wisdom,
      charisma,
      armorClass,
      speed,
      initiative: dexMod,
      story: formData.story.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    const success = await characterStorage.save(newChar);
    setSaving(false);

    if (success) {
      setSuccessBanner(`Personagem "${newChar.name}" salvo com sucesso!`);
      setFormData({
        name: '',
        level: '1',
        className: CLASSES[0],
        raceName: RACES[0],
        backgroundName: BACKGROUNDS[0],
        strength: '10',
        dexterity: '10',
        constitution: '10',
        intelligence: '10',
        wisdom: '10',
        charisma: '10',
        story: ''
      });
      Alert.alert('Sucesso!', `Ficha de "${newChar.name}" criada e salva com sucesso!`, [
        {
          text: 'Ver no Grimório',
          onPress: () => router.push('/(tabs)/characters')
        },
        {
          text: 'Criar Outro',
          style: 'cancel'
        }
      ]);
    } else {
      Alert.alert('Erro', 'Não foi possível salvar o personagem.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Criar Personagem"
        subtitle="Preencha os dados e atributos da ficha D&D 5e"
      />
      <ScrollView contentContainerStyle={styles.container}>
        {successBanner && (
          <View style={styles.bannerContainer}>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            <Text style={styles.bannerText}>{successBanner}</Text>
          </View>
        )}
        <CustomCard>
          <Text style={styles.groupTitle}>Identidade Básica</Text>
          <CustomInput
            label="Nome do Personagem *"
            placeholder="Ex: Conan, Gandalf, Legolas..."
            value={formData.name}
            onChangeText={(t) => handleInputChange('name', t)}
            error={errors.name}
          />
          <CustomInput
            label="Nível (1 a 20) *"
            placeholder="1"
            keyboardType="numeric"
            value={formData.level}
            onChangeText={(t) => handleInputChange('level', t)}
            error={errors.level}
          />

          <Text style={styles.pickerLabel}>Raça:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {RACES.map((race) => (
              <TouchableOpacity
                key={race}
                style={[
                  styles.chip,
                  formData.raceName === race && styles.chipActive
                ]}
                onPress={() => handleInputChange('raceName', race)}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.raceName === race && styles.chipTextActive
                  ]}
                >
                  {race}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.pickerLabel}>Classe:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {CLASSES.map((cls) => (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.chip,
                  formData.className === cls && styles.chipActive
                ]}
                onPress={() => handleInputChange('className', cls)}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.className === cls && styles.chipTextActive
                  ]}
                >
                  {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.pickerLabel}>Antecedente:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {BACKGROUNDS.map((bg) => (
              <TouchableOpacity
                key={bg}
                style={[
                  styles.chip,
                  formData.backgroundName === bg && styles.chipActive
                ]}
                onPress={() => handleInputChange('backgroundName', bg)}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.backgroundName === bg && styles.chipTextActive
                  ]}
                >
                  {bg}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </CustomCard>

        <CustomCard>
          <Text style={styles.groupTitle}>Atributos Principais (1 a 30)</Text>
          <View style={styles.attrRow}>
            <CustomInput
              label="Força (FOR)"
              keyboardType="numeric"
              value={formData.strength}
              onChangeText={(t) => handleInputChange('strength', t)}
              error={errors.strength}
              containerStyle={styles.halfInput}
            />
            <CustomInput
              label="Destreza (DES)"
              keyboardType="numeric"
              value={formData.dexterity}
              onChangeText={(t) => handleInputChange('dexterity', t)}
              error={errors.dexterity}
              containerStyle={styles.halfInput}
            />
          </View>
          <View style={styles.attrRow}>
            <CustomInput
              label="Constituição (CON)"
              keyboardType="numeric"
              value={formData.constitution}
              onChangeText={(t) => handleInputChange('constitution', t)}
              error={errors.constitution}
              containerStyle={styles.halfInput}
            />
            <CustomInput
              label="Inteligência (INT)"
              keyboardType="numeric"
              value={formData.intelligence}
              onChangeText={(t) => handleInputChange('intelligence', t)}
              error={errors.intelligence}
              containerStyle={styles.halfInput}
            />
          </View>
          <View style={styles.attrRow}>
            <CustomInput
              label="Sabedoria (SAB)"
              keyboardType="numeric"
              value={formData.wisdom}
              onChangeText={(t) => handleInputChange('wisdom', t)}
              error={errors.wisdom}
              containerStyle={styles.halfInput}
            />
            <CustomInput
              label="Carisma (CAR)"
              keyboardType="numeric"
              value={formData.charisma}
              onChangeText={(t) => handleInputChange('charisma', t)}
              error={errors.charisma}
              containerStyle={styles.halfInput}
            />
          </View>
        </CustomCard>

        <CustomCard>
          <Text style={styles.groupTitle}>História / Notas (Opcional)</Text>
          <CustomInput
            label="Biografia do Personagem"
            placeholder="Origem, motivações ou anotações..."
            multiline
            numberOfLines={4}
            value={formData.story}
            onChangeText={(t) => handleInputChange('story', t)}
            containerStyle={{ height: 100 }}
          />
        </CustomCard>

        <View style={styles.buttonBox}>
          <CustomButton
            title="Salvar Personagem"
            loading={saving}
            icon={<Ionicons name="save" size={20} color={colors.text} />}
            onPress={handleSave}
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
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98122',
    borderWidth: 1.5,
    borderColor: colors.success,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  bannerText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
    flex: 1
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryLight,
    marginBottom: 14
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 4
  },
  chipsScroll: {
    marginBottom: 16
  },
  chip: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600'
  },
  chipTextActive: {
    color: colors.text,
    fontWeight: '700'
  },
  attrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  halfInput: {
    width: '48%'
  },
  buttonBox: {
    marginBottom: 30,
    marginTop: 10
  }
});
