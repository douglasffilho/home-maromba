import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PlanGeneratorModal } from '../components/PlanGeneratorModal';
import { WorkoutPlanCard } from '../components/WorkoutPlanCard';
import { THEME } from '../constants/theme';
import { PRESET_PLANS } from '../services/workoutGenerator';
import { FitnessLevel, WorkoutPlan, WorkoutRoutine } from '../types';

interface PlansScreenProps {
  currentLevel: FitnessLevel;
  customPlans: WorkoutPlan[];
  onLevelChange: (level: FitnessLevel) => void;
  onStartRoutine: (routine: WorkoutRoutine, planTitle: string) => void;
  onPlanCreated: (plan: WorkoutPlan) => void;
  onDeleteCustomPlan: (planId: string) => void;
}

export const PlansScreen: React.FC<PlansScreenProps> = ({
  currentLevel,
  customPlans,
  onLevelChange,
  onStartRoutine,
  onPlanCreated,
  onDeleteCustomPlan,
}) => {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Filter plans by selected level
  const filteredPresets = PRESET_PLANS.filter((p) => p.level === currentLevel);
  const filteredCustoms = customPlans.filter((p) => p.level === currentLevel);

  const allPlansForLevel = [...filteredCustoms, ...filteredPresets];

  const levelConfigs: Record<
    FitnessLevel,
    { label: string; desc: string; color: string; badge: string }
  > = {
    iniciante: {
      label: 'Iniciante',
      desc: 'Foco em adaptação neuromuscular, postura impecável e consistência de treino.',
      color: THEME.colors.green,
      badge: 'NÍVEL 1 • BASE',
    },
    frequente: {
      label: 'Frequente',
      desc: 'Foco em sobrecarga progressiva, volume balanceado e hipertrofia estética.',
      color: THEME.colors.yellow,
      badge: 'NÍVEL 2 • HIPERTROFIA',
    },
    expert: {
      label: 'Expert',
      desc: 'Alta intensidade, periodização avançada, falha concêntrica e especialização.',
      color: THEME.colors.primary,
      badge: 'NÍVEL 3 • ELITE',
    },
  };

  const activeLevelConfig = levelConfigs[currentLevel];

  return (
    <View style={styles.container}>
      {/* Level Segmented Selector */}
      <View style={styles.levelSelectorContainer}>
        {(['iniciante', 'frequente', 'expert'] as FitnessLevel[]).map((lvl) => {
          const cfg = levelConfigs[lvl];
          const isActive = currentLevel === lvl;

          return (
            <TouchableOpacity
              key={lvl}
              style={[
                styles.levelTab,
                isActive && {
                  borderColor: cfg.color,
                  backgroundColor: 'rgba(21, 26, 39, 0.95)',
                },
              ]}
              onPress={() => onLevelChange(lvl)}
              activeOpacity={0.8}
            >
              <Text style={[styles.levelTabText, isActive && { color: cfg.color }]}>
                {cfg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={allPlansForLevel}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            {/* Level Info Banner */}
            <View style={[styles.levelBanner, { borderColor: activeLevelConfig.color }]}>
              <View style={styles.levelBannerHeader}>
                <View
                  style={[styles.levelBadgePill, { backgroundColor: activeLevelConfig.color }]}
                >
                  <Text style={styles.levelBadgePillText}>{activeLevelConfig.badge}</Text>
                </View>
                <Text style={styles.levelPlanCount}>
                  {allPlansForLevel.length} {allPlansForLevel.length === 1 ? 'plano' : 'planos'}
                </Text>
              </View>
              <Text style={styles.levelBannerDesc}>{activeLevelConfig.desc}</Text>
            </View>

            {/* Smart Plan Generator CTA */}
            <TouchableOpacity
              style={styles.generatorCTA}
              onPress={() => setIsGeneratorOpen(true)}
              activeOpacity={0.85}
            >
              <View style={styles.generatorCTAContent}>
                <View style={styles.generatorCTALeft}>
                  <View style={styles.generatorIconBox}>
                    <MaterialCommunityIcons name="creation" size={24} color={THEME.colors.textInverse} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.generatorCTATitle}>Montar Plano Sob Medida</Text>
                    <Text style={styles.generatorCTASubtitle}>
                      Escolha objetivo, dias e equipamentos para gerar um treino personalizado!
                    </Text>
                  </View>
                </View>
                <Ionicons name="arrow-forward" size={20} color={THEME.colors.primary} />
              </View>
            </TouchableOpacity>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Planos de Treino Disponíveis</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <WorkoutPlanCard
            plan={item}
            onStartRoutine={onStartRoutine}
            onDeletePlan={onDeleteCustomPlan}
          />
        )}
      />

      {/* Plan Generator Modal */}
      <PlanGeneratorModal
        visible={isGeneratorOpen}
        initialLevel={currentLevel}
        onClose={() => setIsGeneratorOpen(false)}
        onPlanCreated={onPlanCreated}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  levelSelectorContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
    gap: 8,
  },
  levelTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: THEME.colors.surfaceElevated,
  },
  levelTabText: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 40,
  },
  levelBanner: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderLeftWidth: 4,
    marginBottom: THEME.spacing.md,
  },
  levelBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  levelBadgePillText: {
    fontSize: 10,
    fontWeight: '900',
    color: THEME.colors.textInverse,
    letterSpacing: 0.5,
  },
  levelPlanCount: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  levelBannerDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    lineHeight: 17,
  },
  generatorCTA: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    marginBottom: THEME.spacing.lg,
  },
  generatorCTAContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  generatorCTALeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 8,
  },
  generatorIconBox: {
    width: 44,
    height: 44,
    borderRadius: THEME.borderRadius.lg,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generatorCTATitle: {
    fontSize: 15,
    fontWeight: '900',
    color: THEME.colors.text,
  },
  generatorCTASubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  sectionHeaderRow: {
    marginBottom: THEME.spacing.md,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

