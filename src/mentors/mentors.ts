import { Mentor } from '../engine/types';

export const MENTORS: Record<string, Mentor> = {
  athenix: {
    id: 'athenix',
    name: 'Athenix',
    emoji: '🦉',
    color: '#7c3aed',
    phases: [1, 2],
  },
  hermes: {
    id: 'hermes',
    name: 'Hermes',
    emoji: '⚡',
    color: '#06b6d4',
    phases: [3, 4],
  },
  apolo: {
    id: 'apolo',
    name: 'Apolo',
    emoji: '🎯',
    color: '#f59e0b',
    phases: [5, 6],
  },
  artemisa: {
    id: 'artemisa',
    name: 'Artemisa',
    emoji: '🏹',
    color: '#ec4899',
    phases: [7, 8],
  },
};
