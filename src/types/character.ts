export interface Character {
  id: string;
  userId?: string;
  name: string;
  level: number;
  xp: number;
  currentHp: number;
  maxHp: number;
  temporaryHp: number;
  status: string;
  className: string;
  raceName: string;
  backgroundName: string;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  armorClass: number;
  speed: number;
  initiative: number;
  story?: string;
  createdAt: string;
}

export interface CharacterFormData {
  name: string;
  level: string;
  className: string;
  raceName: string;
  backgroundName: string;
  strength: string;
  dexterity: string;
  constitution: string;
  intelligence: string;
  wisdom: string;
  charisma: string;
  story: string;
}
