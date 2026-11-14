import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.cardBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textMuted
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={String(color)} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Novo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={String(color)} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="quick-roll"
        options={{
          title: 'Aleatório',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="dice" color={String(color)} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="characters"
        options={{
          title: 'Fichas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield" color={String(color)} size={size} />
          )
        }}
      />
    </Tabs>
  );
}
