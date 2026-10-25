export type FitnessLevel = 'iniciante' | 'frequente' | 'expert';

export type ExerciseDatabaseLevel = 'iniciante' | 'intermediario' | 'avancado';

export type MuscleGroup =
  | 'peito'
  | 'costas'
  | 'dorsais'
  | 'meio-das-costas'
  | 'inferior-das-costas'
  | 'trapezio'
  | 'ombros'
  | 'biceps'
  | 'triceps'
  | 'antebracos'
  | 'quadriceps'
  | 'isquiotibiais'
  | 'gluteos'
  | 'panturrilhas'
  | 'adutores'
  | 'abdutores'
  | 'abdominais'
  | 'pescoco';

export interface Exercise {
  id: string;
  name: string;
  force: 'push' | 'pull' | 'static' | null;
  level: ExerciseDatabaseLevel;
  mechanic: 'composto' | 'isolado' | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

export interface RoutineExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  targetMuscles: string[];
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
  targetWeight?: string;
  exerciseRef?: Exercise;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  subtitle: string;
  targetMuscles: string[];
  exercises: RoutineExercise[];
  estimatedMinutes: number;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  tagline: string;
  level: FitnessLevel;
  splitType: string;
  daysPerWeek: number;
  frequencyDescription: string;
  goal: 'hipertrofia' | 'emagrecimento' | 'forca' | 'condicionamento';
  routines: WorkoutRoutine[];
  isCustom?: boolean;
  createdAt?: string;
}

export interface CompletedWorkout {
  id: string;
  routineName: string;
  planTitle?: string;
  date: string;
  durationSeconds: number;
  totalSets: number;
  exercisesCompletedCount: number;
}

export interface UserStats {
  streak: number;
  lastWorkoutDate: string | null;
  totalWorkouts: number;
  totalMinutes: number;
  selectedLevel: FitnessLevel;
}

