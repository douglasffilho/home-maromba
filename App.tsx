import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ActiveWorkoutModal } from './src/components/ActiveWorkoutModal';
import { BottomNav, TabType } from './src/components/BottomNav';
import { ExerciseDetailModal } from './src/components/ExerciseDetailModal';
import { Header } from './src/components/Header';
import { THEME } from './src/constants/theme';
import { ExercisesScreen } from './src/screens/ExercisesScreen';
import { PlansScreen } from './src/screens/PlansScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { StorageService } from './src/services/storage';
import {
  CompletedWorkout,
  Exercise,
  FitnessLevel,
  UserStats,
  WorkoutPlan,
  WorkoutRoutine,
} from './src/types';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('treinos');

  // App persistent states
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 3,
    lastWorkoutDate: null,
    totalWorkouts: 4,
    totalMinutes: 185,
    selectedLevel: 'iniciante',
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customPlans, setCustomPlans] = useState<WorkoutPlan[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<CompletedWorkout[]>([]);

  // Modals state
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeRoutine, setActiveRoutine] = useState<WorkoutRoutine | null>(null);
  const [activePlanTitle, setActivePlanTitle] = useState<string | undefined>();
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);

  // Load storage data on startup
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const [stats, favs, plans, history] = await Promise.all([
          StorageService.getUserStats(),
          StorageService.getFavorites(),
          StorageService.getCustomPlans(),
          StorageService.getWorkoutHistory(),
        ]);

        setUserStats(stats);
        setFavorites(favs);
        setCustomPlans(plans);
        setWorkoutHistory(history);
      } catch (e) {
        console.error('Failed to load storage data', e);
      } finally {
        setLoading(false);
      }
    };

    loadAppData();
  }, []);

  const handleLevelChange = async (newLevel: FitnessLevel) => {
    await StorageService.setUserLevel(newLevel);
    setUserStats((prev) => ({ ...prev, selectedLevel: newLevel }));
    setIsLevelModalOpen(false);
  };

  const handleToggleFavorite = async (exerciseId: string) => {
    const updated = await StorageService.toggleFavorite(exerciseId);
    setFavorites(updated);
  };

  const handlePlanCreated = async (plan: WorkoutPlan) => {
    const updated = await StorageService.saveCustomPlan(plan);
    setCustomPlans(updated);
  };

  const handleDeleteCustomPlan = async (planId: string) => {
    const updated = await StorageService.deleteCustomPlan(planId);
    setCustomPlans(updated);
  };

  const handleStartRoutine = (routine: WorkoutRoutine, planTitle: string) => {
    setActiveRoutine(routine);
    setActivePlanTitle(planTitle);
  };

  const handleFinishWorkout = async (summary: {
    routineName: string;
    planTitle?: string;
    durationSeconds: number;
    totalSets: number;
    exercisesCompletedCount: number;
  }) => {
    const res = await StorageService.recordWorkout({
      routineName: summary.routineName,
      planTitle: summary.planTitle,
      date: new Date().toISOString(),
      durationSeconds: summary.durationSeconds,
      totalSets: summary.totalSets,
      exercisesCompletedCount: summary.exercisesCompletedCount,
    });

    setWorkoutHistory(res.history);
    setUserStats(res.stats);
    setActiveRoutine(null);
    setActivePlanTitle(undefined);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>Carregando TreineSeuPvt0...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        {/* Top Header */}
        <Header
          stats={userStats}
          onLevelPress={() => setIsLevelModalOpen(true)}
          onStatsPress={() => setActiveTab('progresso')}
        />

        {/* Main Tab Screen Content */}
        <View style={styles.mainContent}>
          {activeTab === 'treinos' && (
            <PlansScreen
              currentLevel={userStats.selectedLevel}
              customPlans={customPlans}
              onLevelChange={handleLevelChange}
              onStartRoutine={handleStartRoutine}
              onPlanCreated={handlePlanCreated}
              onDeleteCustomPlan={handleDeleteCustomPlan}
            />
          )}

          {activeTab === 'exercicios' && (
            <ExercisesScreen
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectExercise={(ex) => setSelectedExercise(ex)}
            />
          )}

          {activeTab === 'progresso' && (
            <ProgressScreen
              stats={userStats}
              workoutHistory={workoutHistory}
              favorites={favorites}
              onLevelChange={handleLevelChange}
              onSelectExercise={(ex) => setSelectedExercise(ex)}
            />
          )}
        </View>

        {/* GymRats Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Exercise Detail Modal with Images & Video */}
        <ExerciseDetailModal
          exercise={selectedExercise}
          visible={selectedExercise !== null}
          isFavorite={selectedExercise ? favorites.includes(selectedExercise.id) : false}
          onClose={() => setSelectedExercise(null)}
          onToggleFavorite={() => {
            if (selectedExercise) {
              handleToggleFavorite(selectedExercise.id);
            }
          }}
          onAddToWorkout={(ex) => {
            setSelectedExercise(null);
            setActiveTab('treinos');
          }}
        />

        {/* Active Workout Tracker Modal */}
        <ActiveWorkoutModal
          visible={activeRoutine !== null}
          routine={activeRoutine}
          planTitle={activePlanTitle}
          onClose={() => setActiveRoutine(null)}
          onFinishWorkout={handleFinishWorkout}
        />

        {/* Quick Level Selector Modal */}
        <Modal
          visible={isLevelModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsLevelModalOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsLevelModalOpen(false)}
          >
            <View style={styles.levelModalCard}>
              <Text style={styles.levelModalTitle}>Selecione seu Nível de Treino</Text>
              <Text style={styles.levelModalSub}>
                Os planos e exercícios recomendados se adaptam automaticamente ao nível selecionado.
              </Text>

              {[
                {
                  id: 'iniciante',
                  label: 'Iniciante',
                  sub: 'Base motora, foco em máquinas e adaptação neuromuscular.',
                  color: THEME.colors.green,
                },
                {
                  id: 'frequente',
                  label: 'Frequente',
                  sub: 'Hipertrofia contínua, divisão ABC/Upper-Lower e pesos livres.',
                  color: THEME.colors.yellow,
                },
                {
                  id: 'expert',
                  label: 'Expert',
                  sub: 'Alta intensidade, divisão ABCDE, técnicas de falha e cargas pesadas.',
                  color: THEME.colors.primary,
                },
              ].map((lvl) => {
                const isSelected = userStats.selectedLevel === lvl.id;
                return (
                  <TouchableOpacity
                    key={lvl.id}
                    style={[
                      styles.levelModalItem,
                      isSelected && {
                        borderColor: lvl.color,
                        backgroundColor: 'rgba(229, 23, 63, 0.1)',
                      },
                    ]}
                    onPress={() => handleLevelChange(lvl.id as FitnessLevel)}
                  >
                    <View style={styles.levelModalItemHeader}>
                      <View style={[styles.dot, { backgroundColor: lvl.color }]} />
                      <Text style={[styles.levelModalItemTitle, { color: lvl.color }]}>
                        {lvl.label}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={lvl.color}
                          style={{ marginLeft: 'auto' }}
                        />
                      )}
                    </View>
                    <Text style={styles.levelModalItemSub}>{lvl.sub}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    marginTop: 12,
  },
  mainContent: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  levelModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  levelModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.colors.text,
    marginBottom: 4,
  },
  levelModalSub: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
    lineHeight: 16,
  },
  levelModalItem: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: THEME.colors.borderSubtle,
  },
  levelModalItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  levelModalItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  levelModalItemSub: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textMuted,
    lineHeight: 15,
  },
});
