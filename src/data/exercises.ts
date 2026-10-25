import { Exercise, MuscleGroup } from '../types';

// Load dataset
const exercisesRaw: Exercise[] = require('../../exercises/exercises-ptbr-full-translation.json');

export const EXERCISES: Exercise[] = exercisesRaw;

// Map by ID for quick O(1) lookup
export const EXERCISE_MAP = new Map<string, Exercise>();
EXERCISES.forEach((ex) => {
  EXERCISE_MAP.set(ex.id, ex);
});

export const getExerciseById = (id: string): Exercise | undefined => {
  return EXERCISE_MAP.get(id);
};

// CDN endpoints for exercise images from original free-exercise-db repository
export const getExerciseImageUrl = (imagePath: string, useJsdelivr = false): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;

  if (useJsdelivr) {
    return `https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/${imagePath}`;
  }
  return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${imagePath}`;
};

export const getExerciseVideoSearchUrl = (exerciseName: string): string => {
  const query = encodeURIComponent(`como fazer exercicio ${exerciseName} execucao correta`);
  return `https://www.youtube.com/results?search_query=${query}`;
};

export const MUSCLE_DISPLAY_MAP: Record<string, string> = {
  peito: 'Peitoral',
  dorsais: 'Dorsais / Costas',
  'meio-das-costas': 'Meio das Costas',
  'inferior-das-costas': 'Lombar',
  ombros: 'Ombros / Deltoides',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  antebracos: 'Antebraços',
  quadriceps: 'Quadríceps',
  isquiotibiais: 'Posterior da Coxa',
  gluteos: 'Glúteos',
  panturrilhas: 'Panturrilhas',
  abdominais: 'Abdômen / Core',
  trapezio: 'Trapézio',
  adutores: 'Adutores',
  abdutores: 'Abdutores',
  pescoco: 'Pescoço',
};

export const EQUIPMENT_DISPLAY_MAP: Record<string, string> = {
  barra: 'Barra',
  'barra-w': 'Barra W / EZ',
  halteres: 'Halteres',
  maquina: 'Máquina',
  cabo: 'Polia / Cabo',
  'peso-do-corpo': 'Peso Corporal',
  kettlebell: 'Kettlebell',
  faixas: 'Elásticos / Faixas',
  'bola-de-exercicio': 'Bola Suíça',
  'bola-medicinal': 'Bola Medicinal',
  'rolo-de-espuma': 'Rolo de Liberação',
  outros: 'Outros',
};

export const LEVEL_DISPLAY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  iniciante: { label: 'Iniciante', color: '#00A859', bg: 'rgba(0, 168, 89, 0.16)' },
  intermediario: { label: 'Frequente', color: '#FFCC00', bg: 'rgba(255, 204, 0, 0.16)' },
  avancado: { label: 'Expert', color: '#E5173F', bg: 'rgba(229, 23, 63, 0.16)' },
};

export const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  forca: 'Musculação / Força',
  pliometria: 'Pliometria',
  alongamento: 'Alongamento',
  cardio: 'Cardio',
  'levantamento-olimpico': 'Levantamento Olímpico',
  powerlifting: 'Powerlifting',
  strongman: 'Strongman',
};

export const formatMuscle = (muscle: string): string => {
  return MUSCLE_DISPLAY_MAP[muscle] || muscle.replace(/-/g, ' ');
};

export const formatEquipment = (equipment?: string | null): string => {
  if (!equipment) return 'Livre / Diversos';
  return EQUIPMENT_DISPLAY_MAP[equipment] || equipment.replace(/-/g, ' ');
};

export const formatLevel = (level: string) => {
  return LEVEL_DISPLAY_MAP[level] || { label: level, color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)' };
};

export const formatCategory = (category: string): string => {
  return CATEGORY_DISPLAY_MAP[category] || category;
};

// Filter pills for quick muscle selection on catalog
export const QUICK_MUSCLE_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'peito', label: 'Peito' },
  { id: 'dorsais', label: 'Costas' },
  { id: 'quadriceps', label: 'Quadríceps' },
  { id: 'isquiotibiais', label: 'Posterior' },
  { id: 'ombros', label: 'Ombros' },
  { id: 'biceps', label: 'Bíceps' },
  { id: 'triceps', label: 'Tríceps' },
  { id: 'abdominais', label: 'Abdômen' },
  { id: 'gluteos', label: 'Glúteos' },
  { id: 'panturrilhas', label: 'Panturrilhas' },
];

export const QUICK_LEVEL_FILTERS = [
  { id: 'all', label: 'Todos Níveis' },
  { id: 'iniciante', label: 'Iniciante' },
  { id: 'intermediario', label: 'Frequente' },
  { id: 'avancado', label: 'Expert' },
];

