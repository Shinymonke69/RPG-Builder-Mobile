import { Character } from '../types/character';
import {
  RACES,
  CLASSES,
  BACKGROUNDS,
  FIRST_NAMES,
  LAST_NAMES,
  CLASS_HIT_DIE
} from '../constants/rpgData';

export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(modifier: number): string {
  if (modifier >= 0) {
    return `+${modifier}`;
  }
  return `${modifier}`;
}

export function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

export function roll4d6DropLowest(): number {
  const rolls = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1
  ];
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

export function generateRandomCharacter(): Character {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const fullName = `${firstName} ${lastName}`;

  const race = RACES[Math.floor(Math.random() * RACES.length)];
  const className = CLASSES[Math.floor(Math.random() * CLASSES.length)];
  const background = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];

  const strength = roll4d6DropLowest();
  const dexterity = roll4d6DropLowest();
  const constitution = roll4d6DropLowest();
  const intelligence = roll4d6DropLowest();
  const wisdom = roll4d6DropLowest();
  const charisma = roll4d6DropLowest();

  const hitDie = CLASS_HIT_DIE[className] || 8;
  const conMod = calculateModifier(constitution);
  const dexMod = calculateModifier(dexterity);

  const maxHp = Math.max(1, hitDie + conMod);
  const armorClass = 10 + dexMod;
  const speed = race === 'Anão' || race === 'Halfling' || race === 'Gnomo' ? 25 : 30;

  return {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
    name: fullName,
    level: 1,
    xp: 0,
    currentHp: maxHp,
    maxHp,
    temporaryHp: 0,
    status: 'Ativo',
    className,
    raceName: race,
    backgroundName: background,
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    armorClass,
    speed,
    initiative: dexMod,
    story: `Personagem gerado aleatoriamente das crônicas de Faerûn.`,
    createdAt: new Date().toISOString()
  };
}
