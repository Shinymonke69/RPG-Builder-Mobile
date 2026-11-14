import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { calculateModifier, formatModifier } from '../services/diceRoller';

interface AttributeBadgeProps {
  label: string;
  score: number;
}

export const AttributeBadge: React.FC<AttributeBadgeProps> = ({
  label,
  score
}) => {
  const mod = calculateModifier(score);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.score}>{score}</Text>
      <View style={styles.modContainer}>
        <Text style={styles.modifier}>{formatModifier(mod)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    width: 52
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase'
  },
  score: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginVertical: 2
  },
  modContainer: {
    backgroundColor: colors.cardBorder,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 2
  },
  modifier: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent
  }
});
