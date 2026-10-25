import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompletedWorkout, FitnessLevel, UserStats, WorkoutPlan } from '../types';

const KEYS = {
  USER_STATS: '@treineseupvt0:user_stats',
  FAVORITES: '@treineseupvt0:favorites',
  CUSTOM_PLANS: '@treineseupvt0:custom_plans',
  WORKOUT_HISTORY: '@treineseupvt0:workout_history',
};

const DEFAULT_STATS: UserStats = {
  streak: 3, // Initial encouragement streak GymRats style
  lastWorkoutDate: null,
  totalWorkouts: 4,
  totalMinutes: 185,
  selectedLevel: 'iniciante',
};

export const StorageService = {
  async getUserStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_STATS);
      if (data) {
        return { ...DEFAULT_STATS, ...JSON.parse(data) };
      }
      await AsyncStorage.setItem(KEYS.USER_STATS, JSON.stringify(DEFAULT_STATS));
      return DEFAULT_STATS;
    } catch (e) {
      console.error('Failed to get user stats', e);
      return DEFAULT_STATS;
    }
  },

  async setUserLevel(level: FitnessLevel): Promise<void> {
    try {
      const current = await this.getUserStats();
      const updated = { ...current, selectedLevel: level };
      await AsyncStorage.setItem(KEYS.USER_STATS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update level', e);
    }
  },

  async getFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get favorites', e);
      return [];
    }
  },

  async toggleFavorite(exerciseId: string): Promise<string[]> {
    try {
      const current = await this.getFavorites();
      let updated: string[];
      if (current.includes(exerciseId)) {
        updated = current.filter((id) => id !== exerciseId);
      } else {
        updated = [...current, exerciseId];
      }
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to toggle favorite', e);
      return [];
    }
  },

  async getCustomPlans(): Promise<WorkoutPlan[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CUSTOM_PLANS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get custom plans', e);
      return [];
    }
  },

  async saveCustomPlan(plan: WorkoutPlan): Promise<WorkoutPlan[]> {
    try {
      const plans = await this.getCustomPlans();
      const existingIndex = plans.findIndex((p) => p.id === plan.id);
      let updated: WorkoutPlan[];
      if (existingIndex >= 0) {
        updated = [...plans];
        updated[existingIndex] = plan;
      } else {
        updated = [plan, ...plans];
      }
      await AsyncStorage.setItem(KEYS.CUSTOM_PLANS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save plan', e);
      return [];
    }
  },

  async deleteCustomPlan(planId: string): Promise<WorkoutPlan[]> {
    try {
      const plans = await this.getCustomPlans();
      const updated = plans.filter((p) => p.id !== planId);
      await AsyncStorage.setItem(KEYS.CUSTOM_PLANS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to delete plan', e);
      return [];
    }
  },

  async getWorkoutHistory(): Promise<CompletedWorkout[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.WORKOUT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get workout history', e);
      return [];
    }
  },

  async recordWorkout(item: Omit<CompletedWorkout, 'id'>): Promise<{ history: CompletedWorkout[]; stats: UserStats }> {
    try {
      const currentHistory = await this.getWorkoutHistory();
      const stats = await this.getUserStats();

      const newRecord: CompletedWorkout = {
        ...item,
        id: 'log_' + Date.now().toString(),
      };

      const updatedHistory = [newRecord, ...currentHistory];
      await AsyncStorage.setItem(KEYS.WORKOUT_HISTORY, JSON.stringify(updatedHistory));

      // Calculate streak
      const today = new Date().toISOString().split('T')[0];
      let newStreak = stats.streak;

      if (!stats.lastWorkoutDate) {
        newStreak = 1;
      } else if (stats.lastWorkoutDate === today) {
        // Already worked out today
      } else {
        const lastDate = new Date(stats.lastWorkoutDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1; // Streak reset
        }
      }

      const updatedStats: UserStats = {
        ...stats,
        streak: newStreak,
        lastWorkoutDate: today,
        totalWorkouts: stats.totalWorkouts + 1,
        totalMinutes: stats.totalMinutes + Math.round(item.durationSeconds / 60),
      };

      await AsyncStorage.setItem(KEYS.USER_STATS, JSON.stringify(updatedStats));

      return { history: updatedHistory, stats: updatedStats };
    } catch (e) {
      console.error('Failed to record workout', e);
      const stats = await this.getUserStats();
      return { history: [], stats };
    }
  },
};

