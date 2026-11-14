import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character } from '../types/character';
import { auth } from '../lib/firebase';

const STORAGE_KEY = '@rpg_builder_characters';

export const characterStorage = {
  async getAll(): Promise<Character[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const list: Character[] = JSON.parse(data);
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) return [];
      return list.filter((c) => c.userId === currentUserId || !c.userId);
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<Character | null> {
    try {
      const list = await this.getAll();
      return list.find((c) => c.id === id) || null;
    } catch {
      return null;
    }
  },

  async save(character: Character): Promise<boolean> {
    try {
      const currentUserId = auth.currentUser?.uid;
      const charWithUser: Character = {
        ...character,
        userId: character.userId || currentUserId || 'anonymous'
      };

      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const fullList: Character[] = raw ? JSON.parse(raw) : [];

      const existingIndex = fullList.findIndex((c) => c.id === charWithUser.id);
      if (existingIndex >= 0) {
        fullList[existingIndex] = charWithUser;
      } else {
        fullList.unshift(charWithUser);
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fullList));
      return true;
    } catch {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return true;
      const fullList: Character[] = JSON.parse(raw);
      const filtered = fullList.filter((c) => c.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  },

  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }
};
