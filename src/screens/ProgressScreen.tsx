import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { getExerciseById } from '../data/exercises';
import { CompletedWorkout, Exercise, FitnessLevel, UserStats } from '../types';

interface ProgressScreenProps {
  stats: UserStats;
  workoutHistory: CompletedWorkout[];
  favorites: string[];
  onLevelChange: (level: FitnessLevel) => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  stats,
  workoutHistory,
  favorites,
  onLevelChange,
  onSelectExercise,
}) => {
  const levelLabels: Record<FitnessLevel, { label: string; color: string; desc: string }> = {
    iniciante: {
      label: 'INICIANTE',
      color: THEME.colors.green,
      desc: 'Construindo o hábito e base motora.',
    },
    frequente: {
      label: 'FREQUENTE',
      color: THEME.colors.yellow,
      desc: 'Rotina ativa com foco em hipertrofia contínua.',
    },
    expert: {
      label: 'EXPERT',
      color: THEME.colors.primary,
      desc: 'Intensidade de elite e progressão máxima.',
    },
  };

  const currentLevelConfig = levelLabels[stats.selectedLevel] || levelLabels.frequente;

  // Resolve favorite exercises
  const favoriteExercises = favorites
    .map((id) => getExerciseById(id))
    .filter((ex): ex is Exercise => ex !== undefined);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* TreineSeuPvt0 Consistency Flame Banner */}
      <View style={styles.streakCard}>
        <View style={styles.streakHeader}>
          <Text style={styles.streakFlameIcon}>🔥</Text>
          <View>
            <Text style={styles.streakCountText}>{stats.streak} Dias Seguidos</Text>
            <Text style={styles.streakSubtitle}>Sequência Ativa no TreineSeuPvt0</Text>
          </View>
        </View>

        <Text style={styles.streakMotivationalQuote}>
          "A constância vence qualquer obstáculo. Mantenha o foco, a força e não desista!"
        </Text>

        {/* Weekly Day Consistency Tracker */}
        <View style={styles.weekTrack}>
          {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, idx) => {
            const isCompleted = idx <= Math.min(stats.streak - 1, 6);
            return (
              <View key={idx} style={styles.dayDotCol}>
                <View style={[styles.dayDot, isCompleted && styles.dayDotActive]}>
                  {isCompleted && (
                    <Ionicons name="checkmark" size={12} color={THEME.colors.textInverse} />
                  )}
                </View>
                <Text style={[styles.dayLabel, isCompleted && styles.dayLabelActive]}>
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Stats Summary Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <MaterialCommunityIcons name="dumbbell" size={24} color={THEME.colors.primary} />
          <Text style={styles.statVal}>{stats.totalWorkouts}</Text>
          <Text style={styles.statLbl}>Treinos Concluídos</Text>
        </View>

        <View style={styles.statBox}>
          <MaterialCommunityIcons name="clock-outline" size={24} color={THEME.colors.cyan} />
          <Text style={styles.statVal}>{stats.totalMinutes}</Text>
          <Text style={styles.statLbl}>Minutos Treinados</Text>
        </View>

        <View style={styles.statBox}>
          <MaterialCommunityIcons name="heart-pulse" size={24} color={THEME.colors.streak} />
          <Text style={styles.statVal}>{favorites.length}</Text>
          <Text style={styles.statLbl}>Exercícios Salvos</Text>
        </View>
      </View>

      {/* Fitness Level Selector Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="shield-star" size={20} color={THEME.colors.primary} />
          <Text style={styles.sectionTitle}>Seu Nível de Atleta</Text>
        </View>

        <Text style={styles.sectionSub}>
          Mude de nível a qualquer momento para atualizar as recomendações de treinos e fichas:
        </Text>

        <View style={styles.levelButtonsRow}>
          {(['iniciante', 'frequente', 'expert'] as FitnessLevel[]).map((lvl) => {
            const cfg = levelLabels[lvl];
            const isCurrent = stats.selectedLevel === lvl;

            return (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.levelSelectBtn,
                  isCurrent && {
                    borderColor: cfg.color,
                    backgroundColor: 'rgba(21, 26, 39, 0.95)',
                  },
                ]}
                onPress={() => onLevelChange(lvl)}
                activeOpacity={0.7}
              >
                <View style={[styles.levelBtnDot, { backgroundColor: cfg.color }]} />
                <Text style={[styles.levelSelectBtnText, isCurrent && { color: cfg.color }]}>
                  {cfg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.currentLevelDesc}>{currentLevelConfig.desc}</Text>
      </View>

      {/* Recent Workouts Log */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="history" size={20} color={THEME.colors.primary} />
          <Text style={styles.sectionTitle}>Histórico de Treinos</Text>
        </View>

        {workoutHistory.length > 0 ? (
          workoutHistory.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={styles.historyIconBox}>
                  <Ionicons name="checkmark-done" size={16} color={THEME.colors.primary} />
                </View>
                <View>
                  <Text style={styles.historyName}>{item.routineName}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(item.date).toLocaleDateString('pt-BR')} •{' '}
                    {Math.round(item.durationSeconds / 60)} min
                  </Text>
                </View>
              </View>

              <View style={styles.historyRight}>
                <Text style={styles.historySets}>{item.totalSets} séries</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyHistoryBox}>
            <Text style={styles.emptyHistoryText}>
              Nenhum treino concluído ainda. Escolha um plano na aba "Planos" e inicie seu primeiro treino!
            </Text>
          </View>
        )}
      </View>

      {/* Saved Favorite Exercises */}
      {favoriteExercises.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={18} color={THEME.colors.red} />
            <Text style={styles.sectionTitle}>Exercícios Favoritos ({favoriteExercises.length})</Text>
          </View>

          <View style={styles.favoritesGrid}>
            {favoriteExercises.map((ex) => (
              <TouchableOpacity
                key={ex.id}
                style={styles.favoriteItem}
                onPress={() => onSelectExercise(ex)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="dumbbell" size={18} color={THEME.colors.primary} />
                <Text style={styles.favoriteItemText} numberOfLines={1}>
                  {ex.name}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={THEME.colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 40,
  },
  streakCard: {
    backgroundColor: '#1C1510',
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1.5,
    borderColor: THEME.colors.streak,
    marginBottom: THEME.spacing.lg,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  streakFlameIcon: {
    fontSize: 40,
  },
  streakCountText: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.colors.streak,
  },
  streakSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
  },
  streakMotivationalQuote: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: THEME.spacing.md,
  },
  weekTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 90, 31, 0.2)',
  },
  dayDotCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  dayDotActive: {
    backgroundColor: THEME.colors.streak,
    borderColor: THEME.colors.streak,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  dayLabelActive: {
    color: THEME.colors.streak,
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: THEME.spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.colors.text,
    marginVertical: 4,
  },
  statLbl: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
    lineHeight: 16,
  },
  levelButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  levelSelectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 6,
  },
  levelBtnDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  levelSelectBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  currentLevelDesc: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    fontStyle: 'italic',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(229, 23, 63, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyName: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  historyDate: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historySets: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  emptyHistoryBox: {
    paddingVertical: 14,
  },
  emptyHistoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textMuted,
    lineHeight: 18,
  },
  favoritesGrid: {
    gap: 8,
    marginTop: 4,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    gap: 10,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  favoriteItemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.text,
  },
});

