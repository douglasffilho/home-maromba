import { EXERCISES, getExerciseById } from '../data/exercises';
import { Exercise, FitnessLevel, RoutineExercise, WorkoutPlan, WorkoutRoutine } from '../types';

export interface GenerateOptions {
  level: FitnessLevel;
  goal: 'hipertrofia' | 'emagrecimento' | 'forca' | 'condicionamento';
  daysPerWeek: number;
  equipmentPreference: 'academia' | 'halteres' | 'corpo';
}

// Find exercise helper
const findExercise = (predicate: (ex: Exercise) => boolean, fallback: Exercise): Exercise => {
  const found = EXERCISES.find(predicate);
  return found || fallback;
};

// Map fitness level to database exercise level
const getMatchingLevels = (level: FitnessLevel): string[] => {
  switch (level) {
    case 'iniciante':
      return ['iniciante'];
    case 'frequente':
      return ['iniciante', 'intermediario'];
    case 'expert':
      return ['intermediario', 'avancado'];
  }
};

const defaultExercise: Exercise = EXERCISES[0];

// Preset Plans Curated by Certified Fitness Logic
export const PRESET_PLANS: WorkoutPlan[] = [
  // ===================== INICIANTE =====================
  {
    id: 'plan_iniciante_ab',
    title: 'Adaptação & Base Estrutural (AB)',
    tagline: 'Ideal para construir fundação de força, tônus muscular e técnica correta.',
    level: 'iniciante',
    splitType: 'Divisão AB (4 Dias)',
    daysPerWeek: 4,
    frequencyDescription: 'Segunda, Terça, Quinta e Sexta (Quarta e fim de semana de descanso)',
    goal: 'hipertrofia',
    routines: [
      {
        id: 'routine_ab_a',
        name: 'Treino A - Superior & Core',
        subtitle: 'Peito, Costas, Ombros, Braços e Abdômen',
        targetMuscles: ['peito', 'dorsais', 'ombros', 'triceps', 'biceps', 'abdominais'],
        estimatedMinutes: 45,
        exercises: [
          {
            id: 'ex_1',
            exerciseId: 'Barbell_Bench_Press_-_Medium_Grip',
            exerciseName: 'Supino Reto com Barra - Pegada Média',
            targetMuscles: ['peito', 'triceps'],
            sets: 3,
            reps: '10-12',
            restSeconds: 60,
            notes: 'Foque em controlar a descida e manter escápulas travadas.',
          },
          {
            id: 'ex_2',
            exerciseId: 'Barbell_Rear_Delt_Row',
            exerciseName: 'Remada para Costas com Barra',
            targetMuscles: ['meio-das-costas', 'dorsais'],
            sets: 3,
            reps: '10-12',
            restSeconds: 60,
            notes: 'Puxe com os cotovelos, sem dar trancos no tronco.',
          },
          {
            id: 'ex_3',
            exerciseId: 'Alternating_Deltoid_Raise',
            exerciseName: 'Elevação Lateral com Halteres',
            targetMuscles: ['ombros'],
            sets: 3,
            reps: '12-15',
            restSeconds: 45,
            notes: 'Eleve até a linha do ombro sem encolher o pescoço.',
          },
          {
            id: 'ex_4',
            exerciseId: 'Barbell_Curl',
            exerciseName: 'Rosca Direta com Barra',
            targetMuscles: ['biceps'],
            sets: 3,
            reps: '10-12',
            restSeconds: 45,
            notes: 'Mantenha os cotovelos fixos ao lado do tronco.',
          },
          {
            id: 'ex_5',
            exerciseId: 'Cable_Incline_Pushdown',
            exerciseName: 'Tríceps Pulley Inclinado',
            targetMuscles: ['triceps'],
            sets: 3,
            reps: '12',
            restSeconds: 45,
            notes: 'Extensão completa no final do movimento.',
          },
          {
            id: 'ex_6',
            exerciseId: '3_4_Sit-Up',
            exerciseName: 'Abdominal 3/4',
            targetMuscles: ['abdominais'],
            sets: 3,
            reps: '15',
            restSeconds: 45,
            notes: 'Concentração máxima na contração do abdômen.',
          },
        ],
      },
      {
        id: 'routine_ab_b',
        name: 'Treino B - Membros Inferiores & Glúteos',
        subtitle: 'Quadríceps, Posterior, Glúteos e Panturrilhas',
        targetMuscles: ['quadriceps', 'isquiotibiais', 'gluteos', 'panturrilhas'],
        estimatedMinutes: 50,
        exercises: [
          {
            id: 'ex_7',
            exerciseId: 'Barbell_Full_Squat',
            exerciseName: 'Agachamento Livre com Barra',
            targetMuscles: ['quadriceps', 'gluteos'],
            sets: 3,
            reps: '10',
            restSeconds: 75,
            notes: 'Pés na largura dos ombros, joelhos alinhados com a ponta dos pés.',
          },
          {
            id: 'ex_8',
            exerciseId: 'Barbell_Side_Split_Squat',
            exerciseName: 'Agachamento Unilateral / Passada',
            targetMuscles: ['quadriceps', 'gluteos'],
            sets: 3,
            reps: '10 cada perna',
            restSeconds: 60,
            notes: 'Excelente para equilíbrio e força unilateral.',
          },
          {
            id: 'ex_9',
            exerciseId: 'Barbell_Glute_Bridge',
            exerciseName: 'Elevação Pélvica com Barra',
            targetMuscles: ['gluteos', 'isquiotibiais'],
            sets: 3,
            reps: '12',
            restSeconds: 60,
            notes: 'Aperte os glúteos no topo por 1 segundo.',
          },
          {
            id: 'ex_10',
            exerciseId: 'Band_Good_Morning_Pull_Through',
            exerciseName: 'Posterior & Lombar com Puxada',
            targetMuscles: ['isquiotibiais', 'inferior-das-costas'],
            sets: 3,
            reps: '12',
            restSeconds: 60,
            notes: 'Empurre o quadril para trás, coluna sempre neutra.',
          },
          {
            id: 'ex_11',
            exerciseId: 'Ankle_Circles',
            exerciseName: 'Panturrilha e Mobilidade de Tornozelo',
            targetMuscles: ['panturrilhas'],
            sets: 4,
            reps: '15-20',
            restSeconds: 45,
            notes: 'Amplitude total: desça bem e suba no máximo.',
          },
        ],
      },
    ],
  },
  {
    id: 'plan_iniciante_fullbody',
    title: 'Full Body Funcional (3 Dias)',
    tagline: 'Estimula todos os grandes grupos musculares 3x na semana com alta recuperação.',
    level: 'iniciante',
    splitType: 'Full Body 3x',
    daysPerWeek: 3,
    frequencyDescription: 'Segunda, Quarta e Sexta',
    goal: 'condicionamento',
    routines: [
      {
        id: 'routine_fb_1',
        name: 'Sessão Full Body Alpha',
        subtitle: 'Corpo Todo - Estímulo Completo',
        targetMuscles: ['quadriceps', 'peito', 'dorsais', 'ombros', 'abdominais'],
        estimatedMinutes: 50,
        exercises: [
          {
            id: 'fb_1',
            exerciseId: 'Barbell_Full_Squat',
            exerciseName: 'Agachamento Livre com Barra',
            targetMuscles: ['quadriceps', 'gluteos'],
            sets: 3,
            reps: '10',
            restSeconds: 60,
            notes: 'Postura firme, olhar para frente.',
          },
          {
            id: 'fb_2',
            exerciseId: 'Barbell_Bench_Press_-_Medium_Grip',
            exerciseName: 'Supino Reto com Barra',
            targetMuscles: ['peito'],
            sets: 3,
            reps: '10',
            restSeconds: 60,
            notes: 'Controle a fase excêntrica.',
          },
          {
            id: 'fb_3',
            exerciseId: 'Barbell_Rear_Delt_Row',
            exerciseName: 'Remada Curvada com Barra',
            targetMuscles: ['dorsais'],
            sets: 3,
            reps: '10',
            restSeconds: 60,
            notes: 'Mantenha o tronco estabilizado.',
          },
          {
            id: 'fb_4',
            exerciseId: 'Alternating_Deltoid_Raise',
            exerciseName: 'Elevação Lateral com Halteres',
            targetMuscles: ['ombros'],
            sets: 3,
            reps: '12',
            restSeconds: 45,
            notes: 'Movimento fluido sem usar impulso.',
          },
          {
            id: 'fb_5',
            exerciseId: '3_4_Sit-Up',
            exerciseName: 'Abdominal no Chão',
            targetMuscles: ['abdominais'],
            sets: 3,
            reps: '15',
            restSeconds: 45,
            notes: 'Foco na respiração e contração.',
          },
        ],
      },
    ],
  },

  // ===================== FREQUENTE (INTERMEDIÁRIO) =====================
  {
    id: 'plan_frequente_abc',
    title: 'Hipertrofia ABC Clássico (Push / Pull / Legs)',
    tagline: 'A divisão dourada dos frequentadores assíduos. Alta densidade e volume equilibrado.',
    level: 'frequente',
    splitType: 'Divisão ABC (5-6 Dias)',
    daysPerWeek: 5,
    frequencyDescription: 'ABCAB ou ABC 2x com domingo de descanso ativo',
    goal: 'hipertrofia',
    routines: [
      {
        id: 'routine_abc_push',
        name: 'Treino A - Push (Peito, Ombros & Tríceps)',
        subtitle: 'Empurrar completo com ênfase em peitoral e deltóide lateral',
        targetMuscles: ['peito', 'ombros', 'triceps'],
        estimatedMinutes: 55,
        exercises: [
          {
            id: 'p_1',
            exerciseId: 'Barbell_Bench_Press_-_Medium_Grip',
            exerciseName: 'Supino Reto com Barra',
            targetMuscles: ['peito'],
            sets: 4,
            reps: '8-10',
            restSeconds: 75,
            notes: 'Última série próxima à falha técnica.',
          },
          {
            id: 'p_2',
            exerciseId: 'Alternating_Floor_Press',
            exerciseName: 'Supino Reto Alternado com Halteres/Kettlebell',
            targetMuscles: ['peito'],
            sets: 3,
            reps: '10-12',
            restSeconds: 60,
            notes: 'Alongamento máximo na descida.',
          },
          {
            id: 'p_3',
            exerciseId: 'Barbell_Shoulder_Press',
            exerciseName: 'Desenvolvimento Militar com Barra',
            targetMuscles: ['ombros'],
            sets: 4,
            reps: '8-10',
            restSeconds: 75,
            notes: 'Core travado, sem hiperextender a lombar.',
          },
          {
            id: 'p_4',
            exerciseId: 'Alternating_Deltoid_Raise',
            exerciseName: 'Elevação Lateral com Halteres',
            targetMuscles: ['ombros'],
            sets: 4,
            reps: '12-15',
            restSeconds: 45,
            notes: 'Cadência 2s na subida e 2s na descida.',
          },
          {
            id: 'p_5',
            exerciseId: 'Cable_Incline_Pushdown',
            exerciseName: 'Tríceps Pulley na Polia',
            targetMuscles: ['triceps'],
            sets: 4,
            reps: '10-12',
            restSeconds: 60,
            notes: 'Cotovelos colados ao corpo.',
          },
        ],
      },
      {
        id: 'routine_abc_pull',
        name: 'Treino B - Pull (Costas, Trapézio & Bíceps)',
        subtitle: 'Puxadas verticais e horizontais para largura e espessura dorsal',
        targetMuscles: ['dorsais', 'meio-das-costas', 'trapezio', 'biceps', 'antebracos'],
        estimatedMinutes: 55,
        exercises: [
          {
            id: 'pl_1',
            exerciseId: 'Barbell_Rear_Delt_Row',
            exerciseName: 'Remada Curvada com Barra',
            targetMuscles: ['dorsais', 'meio-das-costas'],
            sets: 4,
            reps: '8-10',
            restSeconds: 75,
            notes: 'Aperte as escápulas por 1 segundo no topo.',
          },
          {
            id: 'pl_2',
            exerciseId: 'Alternating_Renegade_Row',
            exerciseName: 'Remada Unilateral / Renegade Row',
            targetMuscles: ['dorsais', 'abdominais'],
            sets: 3,
            reps: '10 cada lado',
            restSeconds: 60,
            notes: 'Estabilização total do core.',
          },
          {
            id: 'pl_3',
            exerciseId: 'Barbell_Curl',
            exerciseName: 'Rosca Direta com Barra',
            targetMuscles: ['biceps'],
            sets: 4,
            reps: '10',
            restSeconds: 60,
            notes: 'Foco na fase excêntrica da rosca.',
          },
          {
            id: 'pl_4',
            exerciseId: 'Alternate_Hammer_Curl',
            exerciseName: 'Rosca Martelo Alternada',
            targetMuscles: ['biceps', 'antebracos'],
            sets: 3,
            reps: '12',
            restSeconds: 45,
            notes: 'Desenvolve o braquial e antebraço.',
          },
        ],
      },
      {
        id: 'routine_abc_legs',
        name: 'Treino C - Legs & Core (Pernas Pesadas & Abdômen)',
        subtitle: 'Destruição completa de membros inferiores e cadeia posterior',
        targetMuscles: ['quadriceps', 'isquiotibiais', 'gluteos', 'panturrilhas', 'abdominais'],
        estimatedMinutes: 60,
        exercises: [
          {
            id: 'lg_1',
            exerciseId: 'Barbell_Full_Squat',
            exerciseName: 'Agachamento Livre com Barra',
            targetMuscles: ['quadriceps', 'gluteos'],
            sets: 4,
            reps: '8-10',
            restSeconds: 90,
            notes: 'Respire fundo, trave o abdômen e desça até 90 graus.',
          },
          {
            id: 'lg_2',
            exerciseId: 'Barbell_Hip_Thrust',
            exerciseName: 'Elevação Pélvica com Barra',
            targetMuscles: ['gluteos'],
            sets: 4,
            reps: '10-12',
            restSeconds: 75,
            notes: 'Pausa isométrica de 2 segundos no ponto de maior tensão.',
          },
          {
            id: 'lg_3',
            exerciseId: 'Barbell_Hack_Squat',
            exerciseName: 'Agachamento Hack com Barra',
            targetMuscles: ['quadriceps'],
            sets: 3,
            reps: '10-12',
            restSeconds: 60,
            notes: 'Foco no vasto medial e lateral.',
          },
          {
            id: 'lg_4',
            exerciseId: '3_4_Sit-Up',
            exerciseName: 'Abdominal Crunch Intenso',
            targetMuscles: ['abdominais'],
            sets: 4,
            reps: '15-20',
            restSeconds: 45,
            notes: 'Séries com pausa no pico de contração.',
          },
        ],
      },
    ],
  },
  {
    id: 'plan_frequente_upperlower',
    title: 'Upper / Lower Power & Mass (4 Dias)',
    tagline: 'Frequência de 2x por semana para cada grupo muscular com dias pesados.',
    level: 'frequente',
    splitType: 'Upper / Lower (4 Dias)',
    daysPerWeek: 4,
    frequencyDescription: 'Segunda (Upper), Terça (Lower), Quinta (Upper), Sexta (Lower)',
    goal: 'forca',
    routines: [
      {
        id: 'routine_ul_upper',
        name: 'Upper - Superiores Completo',
        subtitle: 'Peito, Costas, Ombros e Braços',
        targetMuscles: ['peito', 'dorsais', 'ombros', 'triceps', 'biceps'],
        estimatedMinutes: 55,
        exercises: [
          {
            id: 'ul_1',
            exerciseId: 'Barbell_Bench_Press_-_Medium_Grip',
            exerciseName: 'Supino Reto com Barra',
            targetMuscles: ['peito'],
            sets: 4,
            reps: '6-8',
            restSeconds: 90,
            notes: 'Cargas moderadas a altas com técnica impecável.',
          },
          {
            id: 'ul_2',
            exerciseId: 'Barbell_Rear_Delt_Row',
            exerciseName: 'Remada Curvada com Barra',
            targetMuscles: ['dorsais'],
            sets: 4,
            reps: '8',
            restSeconds: 90,
            notes: 'Puxe firme mantendo a postura firme.',
          },
          {
            id: 'ul_3',
            exerciseId: 'Barbell_Shoulder_Press',
            exerciseName: 'Desenvolvimento Militar com Barra',
            targetMuscles: ['ombros'],
            sets: 3,
            reps: '8-10',
            restSeconds: 75,
            notes: 'Empurre para cima com potência.',
          },
          {
            id: 'ul_4',
            exerciseId: 'Barbell_Curl',
            exerciseName: 'Rosca Direta com Barra',
            targetMuscles: ['biceps'],
            sets: 3,
            reps: '10',
            restSeconds: 60,
            notes: 'Trabalho direto de bíceps.',
          },
          {
            id: 'ul_5',
            exerciseId: 'Cable_Incline_Pushdown',
            exerciseName: 'Tríceps Pulley',
            targetMuscles: ['triceps'],
            sets: 3,
            reps: '12',
            restSeconds: 60,
            notes: 'Trabalho direto de tríceps.',
          },
        ],
      },
      {
        id: 'routine_ul_lower',
        name: 'Lower - Inferiores Completo',
        subtitle: 'Quadríceps, Posterior, Glúteos e Abdômen',
        targetMuscles: ['quadriceps', 'isquiotibiais', 'gluteos', 'panturrilhas', 'abdominais'],
        estimatedMinutes: 55,
        exercises: [
          {
            id: 'ull_1',
            exerciseId: 'Barbell_Full_Squat',
            exerciseName: 'Agachamento Livre com Barra',
            targetMuscles: ['quadriceps'],
            sets: 4,
            reps: '6-8',
            restSeconds: 120,
            notes: 'Exercício rei de pernas. Máxima estabilidade.',
          },
          {
            id: 'ull_2',
            exerciseId: 'Barbell_Hip_Thrust',
            exerciseName: 'Elevação Pélvica com Barra',
            targetMuscles: ['gluteos'],
            sets: 4,
            reps: '10',
            restSeconds: 90,
            notes: 'Conexão mente-músculo profunda nos glúteos.',
          },
          {
            id: 'ull_3',
            exerciseId: 'Barbell_Side_Split_Squat',
            exerciseName: 'Passada Unilateral',
            targetMuscles: ['quadriceps', 'gluteos'],
            sets: 3,
            reps: '10 cada',
            restSeconds: 60,
            notes: 'Grande sobrecarga excêntrica.',
          },
          {
            id: 'ull_4',
            exerciseId: '3_4_Sit-Up',
            exerciseName: 'Abdominal Infra / Supra',
            targetMuscles: ['abdominais'],
            sets: 4,
            reps: '15',
            restSeconds: 45,
            notes: 'Fortalecimento do core.',
          },
        ],
      },
    ],
  },

  // ===================== EXPERT (AVANÇADO) =====================
  {
    id: 'plan_expert_abcde',
    title: 'Divisão ABCDE Pro - Especialização Total',
    tagline: 'Para atletas experientes que demandam exaustão por grupo e supercompensação de elite.',
    level: 'expert',
    splitType: 'Divisão ABCDE (5 Dias)',
    daysPerWeek: 5,
    frequencyDescription: 'Segunda a Sexta (1 grupo por dia com volume cavalar)',
    goal: 'hipertrofia',
    routines: [
      {
        id: 'routine_e_chest',
        name: 'Treino A - Peitoral Brutal & Core',
        subtitle: 'Ângulos variados, cargas altas e pico de contração',
        targetMuscles: ['peito', 'abdominais'],
        estimatedMinutes: 60,
        exercises: [
          {
            id: 'ec_1',
            exerciseId: 'Barbell_Bench_Press_-_Medium_Grip',
            exerciseName: 'Supino Reto com Barra - Pegada Média',
            targetMuscles: ['peito'],
            sets: 5,
            reps: '6-8-8-10-12 (Pirâmide)',
            restSeconds: 90,
            notes: 'Aqueça progressivamente até carga máxima segura.',
          },
          {
            id: 'ec_2',
            exerciseId: 'Alternating_Floor_Press',
            exerciseName: 'Supino no Chão com Kettlebell / Halteres',
            targetMuscles: ['peito'],
            sets: 4,
            reps: '8-10',
            restSeconds: 75,
            notes: 'Elimina o impulso e isola o tríceps e peitoral.',
          },
          {
            id: 'ec_3',
            exerciseId: 'Barbell_Guillotine_Bench_Press',
            exerciseName: 'Supino Inclinado / Guilhotina',
            targetMuscles: ['peito'],
            sets: 4,
            reps: '10-12',
            restSeconds: 60,
            notes: 'Foco supremo na parte clavicular do peito.',
          },
          {
            id: 'ec_4',
            exerciseId: '3_4_Sit-Up',
            exerciseName: 'Abdominal Avançado com Carga',
            targetMuscles: ['abdominais'],
            sets: 4,
            reps: '20',
            restSeconds: 45,
            notes: 'Descanso mínimo entre séries.',
          },
        ],
      },
      {
        id: 'routine_e_back',
        name: 'Treino B - Dorsais em V & Lombar',
        subtitle: 'Expansão de dorsais e espessura com remadas pesadas',
        targetMuscles: ['dorsais', 'meio-das-costas', 'inferior-das-costas', 'trapezio'],
        estimatedMinutes: 60,
        exercises: [
          {
            id: 'eb_1',
            exerciseId: 'Barbell_Rear_Delt_Row',
            exerciseName: 'Remada Curvada com Barra - Carga Pesada',
            targetMuscles: ['dorsais'],
            sets: 5,
            reps: '6-8',
            restSeconds: 90,
            notes: 'Trabalho denso para construir costas grossas.',
          },
          {
            id: 'eb_2',
            exerciseId: 'Alternating_Renegade_Row',
            exerciseName: 'Remada Renegada com Kettlebell',
            targetMuscles: ['meio-das-costas'],
            sets: 4,
            reps: '10 cada braço',
            restSeconds: 75,
            notes: 'Estabilização de atleta e força funcional.',
          },
          {
            id: 'eb_3',
            exerciseId: 'Clean_Pull',
            exerciseName: 'Puxada Potente para Clean Olímpico',
            targetMuscles: ['trapezio', 'inferior-das-costas'],
            sets: 4,
            reps: '6',
            restSeconds: 90,
            notes: 'Explosão de quadril e encolhimento violento.',
          },
        ],
      },
      {
        id: 'routine_e_legs',
        name: 'Treino C - Pernas Extremas (Quads, Isquios & Glúteos)',
        subtitle: 'Treino de perna até a falha com compostos pesados',
        targetMuscles: ['quadriceps', 'isquiotibiais', 'gluteos', 'panturrilhas'],
        estimatedMinutes: 65,
        exercises: [
          {
            id: 'el_1',
            exerciseId: 'Barbell_Full_Squat',
            exerciseName: 'Agachamento Livre Profundo',
            targetMuscles: ['quadriceps', 'gluteos'],
            sets: 5,
            reps: '5-6-8-10 (Força & Hipertrofia)',
            restSeconds: 120,
            notes: 'Desça até a paralela ou abaixo com técnica perfeita.',
          },
          {
            id: 'el_2',
            exerciseId: 'Barbell_Hack_Squat',
            exerciseName: 'Agachamento Hack com Barra',
            targetMuscles: ['quadriceps'],
            sets: 4,
            reps: '10',
            restSeconds: 75,
            notes: 'Foco na gota do quadríceps.',
          },
          {
            id: 'el_3',
            exerciseId: 'Barbell_Hip_Thrust',
            exerciseName: 'Elevação Pélvica com Barra',
            targetMuscles: ['gluteos'],
            sets: 4,
            reps: '8-10',
            restSeconds: 90,
            notes: 'Séries pesadas com pausa de contração.',
          },
        ],
      },
      {
        id: 'routine_e_shoulders',
        name: 'Treino D - Ombros 3D & Trapézio',
        subtitle: 'Deltoides anteriores, laterais, posteriores e trapézio',
        targetMuscles: ['ombros', 'trapezio'],
        estimatedMinutes: 55,
        exercises: [
          {
            id: 'es_1',
            exerciseId: 'Barbell_Shoulder_Press',
            exerciseName: 'Desenvolvimento Militar com Barra',
            targetMuscles: ['ombros'],
            sets: 5,
            reps: '6-8',
            restSeconds: 90,
            notes: 'Potência pura de empurrada vertical.',
          },
          {
            id: 'es_2',
            exerciseId: 'Alternating_Deltoid_Raise',
            exerciseName: 'Elevação Lateral com Halteres (Drop-set na última)',
            targetMuscles: ['ombros'],
            sets: 4,
            reps: '12-15',
            restSeconds: 60,
            notes: 'Na 4ª série, reduza 30% da carga e continue sem descanso.',
          },
        ],
      },
      {
        id: 'routine_e_arms',
        name: 'Treino E - Braços Blindados (Super-séries Bíceps & Tríceps)',
        subtitle: 'Pump vascularizado extremo e hipertrofia de braços',
        targetMuscles: ['biceps', 'triceps', 'antebracos'],
        estimatedMinutes: 50,
        exercises: [
          {
            id: 'ea_1',
            exerciseId: 'Barbell_Curl',
            exerciseName: 'Rosca Direta com Barra W / Reta',
            targetMuscles: ['biceps'],
            sets: 4,
            reps: '8-10',
            restSeconds: 60,
            notes: 'Sem balançar o tronco. Tensão contínua.',
          },
          {
            id: 'ea_2',
            exerciseId: 'Cable_Incline_Pushdown',
            exerciseName: 'Tríceps Pulley na Corda',
            targetMuscles: ['triceps'],
            sets: 4,
            reps: '10-12',
            restSeconds: 60,
            notes: 'Abra a corda no final do movimento.',
          },
          {
            id: 'ea_3',
            exerciseId: 'Alternate_Hammer_Curl',
            exerciseName: 'Rosca Martelo com Halteres Pesados',
            targetMuscles: ['biceps', 'antebracos'],
            sets: 4,
            reps: '10 cada braço',
            restSeconds: 60,
            notes: 'Desenvolvimento maciço do antebraço.',
          },
        ],
      },
    ],
  },
  {
    id: 'plan_expert_power',
    title: 'Powerbuilding & Hipertrofia Pesada',
    tagline: 'Combina progressão de carga de powerlifting com técnicas de hipertrofia muscular.',
    level: 'expert',
    splitType: 'Push / Pull / Legs Pro',
    daysPerWeek: 6,
    frequencyDescription: '6 dias consecutivos com 1 dia de descanso para supercompensação',
    goal: 'forca',
    routines: [
      {
        id: 'routine_pb_push',
        name: 'Heavy Push (Peito, Ombros, Tríceps)',
        subtitle: 'Força bruta e volume complementar',
        targetMuscles: ['peito', 'ombros', 'triceps'],
        estimatedMinutes: 60,
        exercises: [
          {
            id: 'pbp_1',
            exerciseId: 'Barbell_Bench_Press_-_Medium_Grip',
            exerciseName: 'Supino Reto com Barra',
            targetMuscles: ['peito'],
            sets: 5,
            reps: '5 repetições pesadas',
            restSeconds: 120,
            notes: 'Carga alta, arco seguro e pés cravados no chão.',
          },
          {
            id: 'pbp_2',
            exerciseId: 'Barbell_Shoulder_Press',
            exerciseName: 'Desenvolvimento Militar com Barra',
            targetMuscles: ['ombros'],
            sets: 4,
            reps: '6-8',
            restSeconds: 90,
            notes: 'Press militar estrito.',
          },
        ],
      },
    ],
  },
];

// Dynamic Plan Generator based on 873 exercises
export const generateCustomPlan = (options: GenerateOptions): WorkoutPlan => {
  const matchingLevels = getMatchingLevels(options.level);

  // Filter pool based on equipment
  const exercisePool = EXERCISES.filter((ex) => {
    const levelMatch = matchingLevels.includes(ex.level);
    if (!levelMatch) return false;

    if (options.equipmentPreference === 'corpo') {
      return ex.equipment === 'peso-do-corpo';
    } else if (options.equipmentPreference === 'halteres') {
      return ex.equipment === 'halteres' || ex.equipment === 'peso-do-corpo';
    }
    return true; // academia completa
  });

  const getExercisesForMuscles = (muscles: string[], count = 4): RoutineExercise[] => {
    const candidates = exercisePool.filter((ex) =>
      ex.primaryMuscles.some((m) => muscles.includes(m))
    );

    const picked = candidates.slice(0, count);
    if (picked.length === 0) {
      // Fallback from general pool
      const genericCandidates = EXERCISES.filter((ex) =>
        ex.primaryMuscles.some((m) => muscles.includes(m))
      );
      picked.push(...genericCandidates.slice(0, count));
    }

    const sets = options.level === 'iniciante' ? 3 : options.level === 'frequente' ? 4 : 4;
    const reps =
      options.goal === 'forca'
        ? '6-8'
        : options.goal === 'emagrecimento'
        ? '12-15'
        : '8-12';
    const rest = options.goal === 'forca' ? 90 : 60;

    return picked.map((ex, idx) => ({
      id: `gen_ex_${Date.now()}_${idx}`,
      exerciseId: ex.id,
      exerciseName: ex.name,
      targetMuscles: ex.primaryMuscles,
      sets,
      reps,
      restSeconds: rest,
      notes: `${sets} séries de ${reps} reps com descanso de ${rest}s.`,
      exerciseRef: ex,
    }));
  };

  const days = options.daysPerWeek;
  const routines: WorkoutRoutine[] = [];

  if (days <= 3) {
    // Full Body or AB
    routines.push({
      id: `gen_rt_${Date.now()}_1`,
      name: 'Treino A - Superior & Core',
      subtitle: 'Peito, Costas, Ombros e Braços',
      targetMuscles: ['peito', 'dorsais', 'ombros', 'biceps', 'triceps', 'abdominais'],
      estimatedMinutes: 45,
      exercises: getExercisesForMuscles(['peito', 'dorsais', 'ombros', 'biceps', 'abdominais'], 5),
    });
    routines.push({
      id: `gen_rt_${Date.now()}_2`,
      name: 'Treino B - Inferiores & Lombar',
      subtitle: 'Pernas Completas, Glúteos e Posterior',
      targetMuscles: ['quadriceps', 'isquiotibiais', 'gluteos', 'panturrilhas'],
      estimatedMinutes: 50,
      exercises: getExercisesForMuscles(['quadriceps', 'isquiotibiais', 'gluteos', 'panturrilhas'], 5),
    });
  } else if (days === 4) {
    // Upper / Lower
    routines.push({
      id: `gen_rt_${Date.now()}_1`,
      name: 'Treino A - Membros Superiores (Foco Peito & Braços)',
      subtitle: 'Peitoral, Deltoides e Bíceps/Tríceps',
      targetMuscles: ['peito', 'ombros', 'triceps', 'biceps'],
      estimatedMinutes: 50,
      exercises: getExercisesForMuscles(['peito', 'ombros', 'biceps', 'triceps'], 5),
    });
    routines.push({
      id: `gen_rt_${Date.now()}_2`,
      name: 'Treino B - Membros Inferiores & Core',
      subtitle: 'Quadríceps, Glúteos e Abdômen',
      targetMuscles: ['quadriceps', 'gluteos', 'abdominais'],
      estimatedMinutes: 50,
      exercises: getExercisesForMuscles(['quadriceps', 'gluteos', 'abdominais'], 5),
    });
    routines.push({
      id: `gen_rt_${Date.now()}_3`,
      name: 'Treino C - Costas & Ombros Posterior',
      subtitle: 'Dorsais, Trapézio e Lombar',
      targetMuscles: ['dorsais', 'meio-das-costas', 'trapezio'],
      estimatedMinutes: 50,
      exercises: getExercisesForMuscles(['dorsais', 'meio-das-costas', 'trapezio'], 5),
    });
    routines.push({
      id: `gen_rt_${Date.now()}_4`,
      name: 'Treino D - Cadeia Posterior & Panturrilhas',
      subtitle: 'Isquiotibiais, Glúteos e Panturrilhas',
      targetMuscles: ['isquiotibiais', 'gluteos', 'panturrilhas'],
      estimatedMinutes: 45,
      exercises: getExercisesForMuscles(['isquiotibiais', 'gluteos', 'panturrilhas'], 5),
    });
  } else {
    // 5 or 6 days: Push / Pull / Legs
    routines.push({
      id: `gen_rt_${Date.now()}_1`,
      name: 'Treino A - Push (Peito, Ombros e Tríceps)',
      subtitle: 'Empurrada completa e trabalho de tríceps',
      targetMuscles: ['peito', 'ombros', 'triceps'],
      estimatedMinutes: 55,
      exercises: getExercisesForMuscles(['peito', 'ombros', 'triceps'], 6),
    });
    routines.push({
      id: `gen_rt_${Date.now()}_2`,
      name: 'Treino B - Pull (Costas e Bíceps)',
      subtitle: 'Puxadas, espessura dorsal e bíceps',
      targetMuscles: ['dorsais', 'meio-das-costas', 'biceps'],
      estimatedMinutes: 55,
      exercises: getExercisesForMuscles(['dorsais', 'meio-das-costas', 'biceps'], 6),
    });
    routines.push({
      id: `gen_rt_${Date.now()}_3`,
      name: 'Treino C - Legs & Abdômen',
      subtitle: 'Quadríceps, Posterior, Glúteos e Core',
      targetMuscles: ['quadriceps', 'isquiotibiais', 'gluteos', 'abdominais'],
      estimatedMinutes: 55,
      exercises: getExercisesForMuscles(['quadriceps', 'isquiotibiais', 'gluteos', 'abdominais'], 6),
    });
  }

  const levelTitles: Record<FitnessLevel, string> = {
    iniciante: 'Adaptação Personalizada (Iniciante)',
    frequente: 'Hipertrofia Pro (Frequente)',
    expert: 'Periodização Máxima (Expert)',
  };

  return {
    id: `plan_gen_${Date.now()}`,
    title: levelTitles[options.level],
    tagline: `Plano sob medida gerado para ${options.daysPerWeek}x na semana com foco em ${options.goal}.`,
    level: options.level,
    splitType: `${options.daysPerWeek} Dias por Semana`,
    daysPerWeek: options.daysPerWeek,
    frequencyDescription: `${options.daysPerWeek} dias de treino programados semanalmente.`,
    goal: options.goal,
    routines,
    isCustom: true,
    createdAt: new Date().toISOString(),
  };
};

