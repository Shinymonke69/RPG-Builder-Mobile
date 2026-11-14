import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { colors } from '../constants/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Não Encontrado' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Tela não encontrada.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Voltar para o início</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text
  },
  link: {
    marginTop: 16,
    paddingVertical: 12
  },
  linkText: {
    fontSize: 16,
    color: colors.primaryLight,
    fontWeight: '600'
  }
});
