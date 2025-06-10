export interface CharacterFormData {
  name: string;
  type: 'player' | 'npc';
  gender: 'mal' | 'fem';
  image: string;
  notes: string;
}

export const defaultCharacterForm: CharacterFormData = {
  name: '',
  type: 'npc',
  gender: 'mal',
  image: '',
  notes: '',
}; 