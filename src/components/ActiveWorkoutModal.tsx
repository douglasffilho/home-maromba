import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { WorkoutRoutine } from '../types';

interface ActiveWorkoutModalProps {
  visible: boolean;
  routine: WorkoutRoutine | null;
  planTitle?: string;
  onClose: () => void;
  onFinishWorkout: (summary: {
    routineName: string;
    planTitle?: string;
    durationSeconds: number;
    totalSets: number;
    exercisesCompletedCount: number;
  }) => void;
}

interface SetLog {
  completed: boolean;
  reps: string;
  weight: string;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  visible,
  routine,
  planTitle,
  onClose,
  onFinishWorkout,
}) => {
  // Elapsed time tracker
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Rest timer
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);
  const [restTimerTotal, setRestTimerTotal] = useState(60);

  // Completed sets tracker: exerciseIndex -> setIndex -> SetLog
  const [setsState, setSetsState] = useState<Record<string, SetLog>>({});

  // Summary popup
  const [showCelebration, setShowCelebration] = useState(false);

  // Workout duration stopwatch
  useEffect(() => {
    let interval: any = null;
    if (visible && !showCelebration) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [visible, showCelebration]);

  // Rest timer interval
  useEffect(() => {
    let restInterval: any = null;
    if (restSecondsRemaining !== null && restSecondsRemaining > 0) {
      restInterval = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev === null || prev <= 1) {
            try {
              Vibration.vibrate([0, 300, 150, 300]);
            } catch (e) {
              // Ignore
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (restInterval) clearInterval(restInterval);
    };
  }, [restSecondsRemaining]);

  // Reset when routine changes
  useEffect(() => {
    if (visible && routine) {
      setElapsedSeconds(0);
      setRestSecondsRemaining(null);
      setShowCelebration(false);

      const initialSets: Record<string, SetLog> = {};
      routine.exercises.forEach((ex, exIdx) => {
        for (let s = 0; s < ex.sets; s++) {
          initialSets[`${exIdx}_${s}`] = {
            completed: false,
            reps: ex.reps.split('-')[0] || '10',
            weight: '',
          };
        }
      });
      setSetsState(initialSets);
    }
  }, [visible, routine]);

  if (!routine) return null;

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSetCompleted = (exIdx: number, setIdx: number, restSeconds: number) => {
    const key = `${exIdx}_${setIdx}`;
    const current = setsState[key] || { completed: false, reps: '10', weight: '' };
    const nextCompleted = !current.completed;

    setSetsState((prev) => ({
      ...prev,
      [key]: { ...current, completed: nextCompleted },
    }));

    if (nextCompleted) {
      try {
        Vibration.vibrate(80);
      } catch (e) {
        // Ignore
      }
      setRestTimerTotal(restSeconds || 60);
      setRestSecondsRemaining(restSeconds || 60);
    }
  };

  const updateSetData = (exIdx: number, setIdx: number, field: 'reps' | 'weight', val: string) => {
    const key = `${exIdx}_${setIdx}`;
    const current = setsState[key] || { completed: false, reps: '10', weight: '' };
    setSetsState((prev) => ({
      ...prev,
      [key]: { ...current, [field]: val },
    }));
  };

  const completedSetsCount = Object.values(setsState).filter((s) => s.completed).length;
  const totalSetsCount = Object.keys(setsState).length;

  const handleFinish = () => {
    if (completedSetsCount === 0) {
      Alert.alert(
        'Nenhuma série concluída',
        'Deseja realmente finalizar o treino sem registrar séries?',
        [
          { text: 'Continuar Treinando', style: 'cancel' },
          { text: 'Finalizar', style: 'destructive', onPress: () => onClose() },
        ]
      );
      return;
    }

    setShowCelebration(true);
  };

  const confirmCelebrationFinish = () => {
    setShowCelebration(false);
    onFinishWorkout({
      routineName: routine.name,
      planTitle,
      durationSeconds: elapsedSeconds,
      totalSets: completedSetsCount,
      exercisesCompletedCount: routine.exercises.length,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Workout Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              Alert.alert('Sair do Treino', 'O treino atual será cancelado. Deseja sair?', [
                { text: 'Não', style: 'cancel' },
                { text: 'Sair', style: 'destructive', onPress: onClose },
              ]);
            }}
          >
            <Ionicons name="close" size={24} color={THEME.colors.text} />
          </TouchableOpacity>

          <View style={styles.timerDisplay}>
            <MaterialCommunityIcons name="timer-outline" size={18} color={THEME.colors.primary} />
            <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
          </View>

          <TouchableOpacity style={styles.finishTopBtn} onPress={handleFinish}>
            <Text style={styles.finishTopBtnText}>Concluir</Text>
          </TouchableOpacity>
        </View>

        {/* Routine Name & Stats Banner */}
        <View style={styles.routineBanner}>
          <View>
            <Text style={styles.routineTitle}>{routine.name}</Text>
            <Text style={styles.planSub}>{planTitle || 'TreineSeuPvt0 Treino Ativo'}</Text>
          </View>
          <View style={styles.progressRing}>
            <Text style={styles.progressRingText}>
              {completedSetsCount}/{totalSetsCount}
            </Text>
            <Text style={styles.progressRingLabel}>Séries</Text>
          </View>
        </View>

        {/* Rest Timer Floating Bar (When active) */}
        {restSecondsRemaining !== null && (
          <View style={styles.restFloatingBar}>
            <View style={styles.restLeft}>
              <Text style={styles.restFlameIcon}>⏳</Text>
              <View>
                <Text style={styles.restTitle}>Tempo de Descanso</Text>
                <Text style={styles.restCountdown}>{restSecondsRemaining}s</Text>
              </View>
            </View>

            <View style={styles.restActions}>
              <TouchableOpacity
                style={styles.restTimeBtn}
                onPress={() => setRestSecondsRemaining((prev) => (prev ? prev + 15 : 15))}
              >
                <Text style={styles.restTimeBtnText}>+15s</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.restSkipBtn}
                onPress={() => setRestSecondsRemaining(null)}
              >
                <Text style={styles.restSkipBtnText}>Pular</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Exercises & Sets Scroll */}
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {routine.exercises.map((exercise, exIdx) => (
            <View key={exercise.id || exIdx} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseBadge}>
                  <Text style={styles.exerciseBadgeText}>{exIdx + 1}</Text>
                </View>
                <View style={styles.exerciseTitleArea}>
                  <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                  <Text style={styles.exerciseTargetText}>
                    Alvo: {exercise.reps} reps • Descanso: {exercise.restSeconds}s
                  </Text>
                </View>
              </View>

              {exercise.notes ? (
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>💡 {exercise.notes}</Text>
                </View>
              ) : null}

              {/* Sets Table */}
              <View style={styles.setsTable}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.colHeader, { width: 40 }]}>SÉRIE</Text>
                  <Text style={[styles.colHeader, { flex: 1 }]}>CARGA (KG)</Text>
                  <Text style={[styles.colHeader, { flex: 1 }]}>REPETIÇÕES</Text>
                  <Text style={[styles.colHeader, { width: 50, textAlign: 'center' }]}>FEITO</Text>
                </View>

                {Array.from({ length: exercise.sets }).map((_, setIdx) => {
                  const key = `${exIdx}_${setIdx}`;
                  const currentSet = setsState[key] || {
                    completed: false,
                    reps: exercise.reps.split('-')[0] || '10',
                    weight: '',
                  };

                  return (
                    <View
                      key={setIdx}
                      style={[styles.setRow, currentSet.completed && styles.setRowCompleted]}
                    >
                      <Text
                        style={[
                          styles.setNumText,
                          currentSet.completed && { color: THEME.colors.primary },
                        ]}
                      >
                        {setIdx + 1}
                      </Text>

                      {/* Weight Input */}
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={styles.setInput}
                          keyboardType="numeric"
                          placeholder="—"
                          placeholderTextColor={THEME.colors.textMuted}
                          value={currentSet.weight}
                          onChangeText={(val) => updateSetData(exIdx, setIdx, 'weight', val)}
                        />
                      </View>

                      {/* Reps Input */}
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={styles.setInput}
                          keyboardType="numeric"
                          value={currentSet.reps}
                          onChangeText={(val) => updateSetData(exIdx, setIdx, 'reps', val)}
                        />
                      </View>

                      {/* Checkbox button */}
                      <TouchableOpacity
                        style={[
                          styles.checkboxBtn,
                          currentSet.completed && styles.checkboxBtnChecked,
                        ]}
                        onPress={() => toggleSetCompleted(exIdx, setIdx, exercise.restSeconds)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={currentSet.completed ? 'checkmark' : 'checkmark-outline'}
                          size={18}
                          color={
                            currentSet.completed
                              ? THEME.colors.textInverse
                              : THEME.colors.textSecondary
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Finish Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.finishWorkoutButton}
            onPress={handleFinish}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="trophy" size={20} color={THEME.colors.textInverse} />
            <Text style={styles.finishWorkoutText}>Finalizar Treino Monstro</Text>
          </TouchableOpacity>
        </View>

        {/* Celebration / GymRats Achievement Modal */}
        <Modal visible={showCelebration} transparent animationType="fade">
          <View style={styles.celebrationOverlay}>
            <View style={styles.celebrationCard}>
              <Text style={styles.celebrationFlame}>🔥</Text>
              <Text style={styles.celebrationTitle}>TREINO FINALIZADO!</Text>
              <Text style={styles.celebrationSubtitle}>
                Mais um dia pago com raça e dedicação. A força e a vitória pertencem a quem não desiste!
              </Text>

              <View style={styles.celebrationStatsGrid}>
                <View style={styles.celebrationStat}>
                  <Text style={styles.celebrationStatVal}>{formatTime(elapsedSeconds)}</Text>
                  <Text style={styles.celebrationStatLbl}>Tempo Total</Text>
                </View>
                <View style={styles.celebrationStat}>
                  <Text style={styles.celebrationStatVal}>{completedSetsCount}</Text>
                  <Text style={styles.celebrationStatLbl}>Séries Feitas</Text>
                </View>
                <View style={styles.celebrationStat}>
                  <Text style={styles.celebrationStatVal}>+1</Text>
                  <Text style={styles.celebrationStatLbl}>Dia de Streak</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.celebrationBtn}
                onPress={confirmCelebrationFinish}
                activeOpacity={0.8}
              >
                <Text style={styles.celebrationBtnText}>Salvar & Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  closeBtn: {
    padding: 6,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    gap: 6,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.primary,
    fontVariant: ['tabular-nums'],
  },
  finishTopBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
  },
  finishTopBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textInverse,
  },
  routineBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  routineTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  planSub: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  progressRing: {
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(229, 23, 63, 0.35)',
  },
  progressRingText: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  progressRingLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  restFloatingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1810',
    marginHorizontal: THEME.spacing.md,
    marginTop: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: THEME.colors.streak,
  },
  restLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  restFlameIcon: {
    fontSize: 22,
  },
  restTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
  },
  restCountdown: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.colors.streak,
  },
  restActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  restTimeBtn: {
    backgroundColor: 'rgba(255, 90, 31, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.sm,
  },
  restTimeBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.streak,
  },
  restSkipBtn: {
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.sm,
  },
  restSkipBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.md,
    paddingBottom: 40,
  },
  exerciseCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  exerciseBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: THEME.colors.textInverse,
  },
  exerciseTitleArea: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  exerciseTargetText: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  notesBox: {
    backgroundColor: THEME.colors.surfaceElevated,
    padding: 8,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: 10,
  },
  notesText: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
  },
  setsTable: {
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
    marginBottom: 4,
  },
  colHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
    marginVertical: 2,
    paddingHorizontal: 4,
  },
  setRowCompleted: {
    backgroundColor: 'rgba(229, 23, 63, 0.08)',
  },
  setNumText: {
    width: 40,
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textSecondary,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  setInput: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.borderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.text,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  checkboxBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: THEME.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginLeft: 4,
  },
  checkboxBtnChecked: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  bottomBar: {
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
    backgroundColor: THEME.colors.background,
  },
  finishWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    gap: 8,
  },
  finishWorkoutText: {
    fontSize: 15,
    fontWeight: '900',
    color: THEME.colors.textInverse,
    letterSpacing: 0.3,
  },
  celebrationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  celebrationCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  celebrationFlame: {
    fontSize: 54,
    marginBottom: 10,
  },
  celebrationTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.colors.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  celebrationSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: THEME.spacing.lg,
    lineHeight: 18,
  },
  celebrationStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: THEME.colors.surfaceElevated,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    marginBottom: THEME.spacing.xl,
  },
  celebrationStat: {
    flex: 1,
    alignItems: 'center',
  },
  celebrationStatVal: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.colors.text,
  },
  celebrationStatLbl: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  celebrationBtn: {
    backgroundColor: THEME.colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
  },
  celebrationBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: THEME.colors.textInverse,
  },
});

