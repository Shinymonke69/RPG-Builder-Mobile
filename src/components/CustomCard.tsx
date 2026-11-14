import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../constants/colors';

interface CustomCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'highlight' | 'compact';
}

export const CustomCard: React.FC<CustomCardProps> = ({
  children,
  style,
  variant = 'default'
}) => {
  return (
    <View
      style={[
        styles.card,
        variant === 'highlight' && styles.cardHighlight,
        variant === 'compact' && styles.cardCompact,
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16
  },
  cardHighlight: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: colors.cardSecondary
  },
  cardCompact: {
    padding: 12,
    marginBottom: 8
  }
});
