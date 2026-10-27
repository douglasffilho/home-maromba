import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { formatMuscle } from '../data/exercises';
import { FitnessLevel, WorkoutPlan, WorkoutRoutine } from '../types';

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
  onStartRoutine: (routine: WorkoutRoutine, planTitle: string) => void;
  onDeletePlan?: (planId: string) => void;
}

export const WorkoutPlanCard: React.FC<WorkoutPlanCardProps> = ({
  plan,
  onStartRoutine,
  onDeletePlan,
}) => {
  const [expanded, setExpanded] = useState(false);

  const levelBadges: Record<FitnessLevel, { label: string; color: string; bg: string }> = {
    iniciante: { label: 'INICIANTE', color: THEME.colors.green, bg: 'rgba(0, 168, 89, 0.16)' },
    frequente: { label: 'FREQUENTE', color: THEME.colors.yellow, bg: 'rgba(255, 204, 0, 0.16)' },
    expert: { label: 'EXPERT', color: THEME.colors.primary, bg: 'rgba(229, 23, 63, 0.16)' },
  };

  const currentLevelBadge = levelBadges[plan.level] || levelBadges.frequente;

  return (
    <View style={[styles.card, plan.isCustom && styles.customCard]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.badgesRow}>
          <View style={[styles.levelBadge, { backgroundColor: currentLevelBadge.bg }]}>
            <Text style={[styles.levelBadgeText, { color: currentLevelBadge.color }]}>
              {currentLevelBadge.label}
            </Text>
          </View>
          <View style={styles.daysBadge}>
            <Ionicons name="calendar-outline" size={11} color={THEME.colors.textSecondary} />
            <Text style={styles.daysBadgeText}>{plan.daysPerWeek}x / semana</Text>
          </View>
          {plan.isCustom && (
            <View style={styles.customBadge}>
              <Ionicons name="person" size={10} color={THEME.colors.purple} style={{ marginRight: 4 }} />
              <Text style={styles.customBadgeText}>CRIADO POR VOCÊ</Text>
            </View>
          )}
        </View>

        {onDeletePlan && plan.isCustom && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDeletePlan(plan.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={16} color={THEME.colors.red} />
          </TouchableOpacity>
        )}
      </View>

      {/* Plan Title & Tagline */}
      <Text style={styles.title}>{plan.title}</Text>
      <Text style={styles.tagline}>{plan.tagline}</Text>

      {/* Routines Summary */}
      <View style={styles.routinesList}>
        {plan.routines.map((routine, idx) => (
          <View
            key={routine.id || idx}
            style={[styles.routineItem, plan.isCustom && styles.customRoutineItem]}
          >
            <View style={styles.routineHeader}>
              <View style={styles.routineTitleBlock}>
                <Text style={styles.routineName}>{routine.name}</Text>
                <Text style={styles.routineSubtitle} numberOfLines={1}>
                  {routine.subtitle}
                </Text>
              </View>

              {/* Start Routine Button */}
              <TouchableOpacity
                style={styles.startRoutineBtn}
                onPress={() => onStartRoutine(routine, plan.title)}
                activeOpacity={0.8}
              >
                <Ionicons name="play" size={13} color={THEME.colors.textInverse} />
                <Text style={styles.startRoutineBtnText}>Treinar</Text>
              </TouchableOpacity>
            </View>

            {/* Target Muscles Pills */}
            <View style={styles.muscleTags}>
              {routine.targetMuscles.slice(0, 4).map((muscle, mIdx) => (
                <View key={mIdx} style={styles.musclePill}>
                  <Text style={styles.musclePillText}>{formatMuscle(muscle)}</Text>
                </View>
              ))}
              <Text style={styles.exerciseCountText}>
                {routine.exercises.length} exercícios • ~{routine.estimatedMinutes || 50} min
              </Text>
            </View>

            {/* Expanded Exercise Breakdown */}
            {expanded && (
              <View style={styles.expandedExercises}>
                <View style={styles.expandedDivider} />
                {routine.exercises.map((ex, eIdx) => (
                  <View key={ex.id || eIdx} style={styles.exerciseRow}>
                    <View
                      style={[
                        styles.exerciseNum,
                        plan.isCustom && styles.customExerciseNum,
                      ]}
                    >
                      <Text style={styles.exerciseNumText}>{eIdx + 1}</Text>
                    </View>
                    <View style={styles.exerciseDetails}>
                      <Text style={styles.exerciseNameText}>{ex.exerciseName}</Text>
                      <Text style={styles.exerciseMetaText}>
                        {ex.sets} séries × {ex.reps} reps • Descanso: {ex.restSeconds}s
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Expand / Collapse Details Button */}
      <TouchableOpacity
        style={styles.expandToggle}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.expandToggleText}>
          {expanded ? 'Recolher Exercícios' : 'Ver Todos os Exercícios do Plano'}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={THEME.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  customCard: {
    backgroundColor: THEME.colors.surfaceCustom,
    borderColor: THEME.colors.borderCustom,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  daysBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  daysBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  customBadge: {
    backgroundColor: 'rgba(176, 66, 255, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.purple,
  },
  deleteBtn: {
    padding: 6,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: 'rgba(255, 51, 75, 0.12)',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
    lineHeight: 17,
  },
  routinesList: {
    gap: 12,
  },
  routineItem: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  customRoutineItem: {
    backgroundColor: THEME.colors.surfaceCustomElevated,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routineTitleBlock: {
    flex: 1,
    marginRight: 10,
  },
  routineName: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  routineSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  startRoutineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    gap: 4,
  },
  startRoutineBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textInverse,
  },
  muscleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  musclePill: {
    backgroundColor: 'rgba(229, 23, 63, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  musclePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  exerciseCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginLeft: 4,
  },
  expandedExercises: {
    marginTop: 10,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginBottom: 8,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  exerciseNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  customExerciseNum: {
    backgroundColor: THEME.colors.surfaceCustom,
  },
  exerciseNumText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  exerciseMetaText: {
    fontSize: 10,
    fontWeight: '500',
    color: THEME.colors.textMuted,
  },
  expandToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: THEME.spacing.md,
    gap: 6,
  },
  expandToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
});

