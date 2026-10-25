import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { generateCustomPlan } from '../services/workoutGenerator';
import { FitnessLevel, WorkoutPlan } from '../types';

interface PlanGeneratorModalProps {
  visible: boolean;
  initialLevel: FitnessLevel;
  onClose: () => void;
  onPlanCreated: (plan: WorkoutPlan) => void;
}

export const PlanGeneratorModal: React.FC<PlanGeneratorModalProps> = ({
  visible,
  initialLevel,
  onClose,
  onPlanCreated,
}) => {
  const [level, setLevel] = useState<FitnessLevel>(initialLevel);
  const [goal, setGoal] = useState<'hipertrofia' | 'emagrecimento' | 'forca' | 'condicionamento'>('hipertrofia');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [equipmentPreference, setEquipmentPreference] = useState<'academia' | 'halteres' | 'corpo'>('academia');

  // Preview generated plan
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);

  const handleGenerate = () => {
    const plan = generateCustomPlan({
      level,
      goal,
      daysPerWeek,
      equipmentPreference,
    });
    setGeneratedPlan(plan);
  };

  const handleSaveAndStart = () => {
    if (generatedPlan) {
      onPlanCreated(generatedPlan);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={THEME.colors.text} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Montar Plano de Treino</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {!generatedPlan ? (
            <>
              {/* Introduction Banner */}
              <View style={styles.banner}>
                <MaterialCommunityIcons name="lightning-bolt" size={28} color={THEME.colors.primary} />
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>TreineSeuPvt0 Workout Builder</Text>
                  <Text style={styles.bannerSubtitle}>
                    O algoritmo monta uma periodização sob medida a partir dos mais de 800 exercícios da nossa base de dados.
                  </Text>
                </View>
              </View>

              {/* Step 1: Level */}
              <View style={styles.stepSection}>
                <Text style={styles.stepTitle}>1. Qual o seu nível de treino?</Text>
                <View style={styles.optionsCol}>
                  {[
                    {
                      id: 'iniciante',
                      label: 'Iniciante',
                      desc: 'Menos de 6 meses. Foco em base motora, máquinas e postura correta.',
                      color: THEME.colors.green,
                    },
                    {
                      id: 'frequente',
                      label: 'Frequente',
                      desc: 'Treina com consistência há mais de 6 meses. Foco em hipertrofia e progressão.',
                      color: THEME.colors.yellow,
                    },
                    {
                      id: 'expert',
                      label: 'Expert',
                      desc: 'Mais de 2 anos de experiência. Treino de alta intensidade, pesos livres e técnicas avançadas.',
                      color: THEME.colors.primary,
                    },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.levelOption,
                        level === item.id && {
                          borderColor: item.color,
                          backgroundColor: 'rgba(21, 26, 39, 0.9)',
                        },
                      ]}
                      onPress={() => setLevel(item.id as FitnessLevel)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionHeader}>
                        <View style={[styles.dot, { backgroundColor: item.color }]} />
                        <Text style={[styles.optionLabel, { color: item.color }]}>{item.label}</Text>
                        {level === item.id && (
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color={item.color}
                            style={{ marginLeft: 'auto' }}
                          />
                        )}
                      </View>
                      <Text style={styles.optionDesc}>{item.desc}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Step 2: Goal */}
              <View style={styles.stepSection}>
                <Text style={styles.stepTitle}>2. Qual é o seu principal objetivo?</Text>
                <View style={styles.grid2}>
                  {[
                    { id: 'hipertrofia', label: 'Hipertrofia Muscular', icon: 'arm-flex' },
                    { id: 'emagrecimento', label: 'Definição & Secar', icon: 'fire' },
                    { id: 'forca', label: 'Ganho de Força', icon: 'weight-lifter' },
                    { id: 'condicionamento', label: 'Condicionamento', icon: 'heart-pulse' },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.goalOption,
                        goal === item.id && styles.goalOptionActive,
                      ]}
                      onPress={() => setGoal(item.id as any)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name={item.icon as any}
                        size={24}
                        color={goal === item.id ? THEME.colors.primary : THEME.colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.goalOptionLabel,
                          goal === item.id && styles.goalOptionLabelActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Step 3: Days per Week */}
              <View style={styles.stepSection}>
                <Text style={styles.stepTitle}>3. Quantos dias você vai treinar na semana?</Text>
                <View style={styles.daysRow}>
                  {[2, 3, 4, 5, 6].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.dayBox,
                        daysPerWeek === num && styles.dayBoxActive,
                      ]}
                      onPress={() => setDaysPerWeek(num)}
                    >
                      <Text
                        style={[
                          styles.dayBoxNum,
                          daysPerWeek === num && styles.dayBoxNumActive,
                        ]}
                      >
                        {num}x
                      </Text>
                      <Text
                        style={[
                          styles.dayBoxSub,
                          daysPerWeek === num && styles.dayBoxSubActive,
                        ]}
                      >
                        dias
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Step 4: Equipment */}
              <View style={styles.stepSection}>
                <Text style={styles.stepTitle}>4. Equipamento disponível</Text>
                <View style={styles.equipCol}>
                  {[
                    { id: 'academia', label: 'Academia Completa', sub: 'Barras, halteres, cabos, polias e máquinas' },
                    { id: 'halteres', label: 'Casa / Halteres & Peso Corporal', sub: 'Treino eficiente em casa ou condomínio' },
                    { id: 'corpo', label: 'Apenas Peso do Corpo (Calistenia)', sub: 'Zero equipamentos necessários' },
                  ].map((eq) => (
                    <TouchableOpacity
                      key={eq.id}
                      style={[
                        styles.equipItem,
                        equipmentPreference === eq.id && styles.equipItemActive,
                      ]}
                      onPress={() => setEquipmentPreference(eq.id as any)}
                    >
                      <View>
                        <Text
                          style={[
                            styles.equipLabel,
                            equipmentPreference === eq.id && styles.equipLabelActive,
                          ]}
                        >
                          {eq.label}
                        </Text>
                        <Text style={styles.equipSub}>{eq.sub}</Text>
                      </View>
                      {equipmentPreference === eq.id && (
                        <Ionicons name="checkmark-circle" size={20} color={THEME.colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Generate Button */}
              <TouchableOpacity
                style={styles.generateBtn}
                onPress={handleGenerate}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="lightning-bolt" size={20} color={THEME.colors.textInverse} />
                <Text style={styles.generateBtnText}>Gerar Meu Plano Agora</Text>
              </TouchableOpacity>
            </>
          ) : (
            /* Generated Plan Preview Screen */
            <View style={styles.previewContainer}>
              <View style={styles.previewHeader}>
                <Ionicons name="checkmark-done-circle" size={44} color={THEME.colors.primary} />
                <Text style={styles.previewTitle}>Plano Gerado com Sucesso!</Text>
                <Text style={styles.previewTagline}>{generatedPlan.tagline}</Text>
              </View>

              <View style={styles.previewStats}>
                <View style={styles.previewStatCol}>
                  <Text style={styles.previewStatVal}>{generatedPlan.daysPerWeek}x</Text>
                  <Text style={styles.previewStatLbl}>Semana</Text>
                </View>
                <View style={styles.previewStatCol}>
                  <Text style={styles.previewStatVal}>{generatedPlan.routines.length}</Text>
                  <Text style={styles.previewStatLbl}>Divisões (Fichas)</Text>
                </View>
                <View style={styles.previewStatCol}>
                  <Text style={styles.previewStatVal}>{generatedPlan.level.toUpperCase()}</Text>
                  <Text style={styles.previewStatLbl}>Nível</Text>
                </View>
              </View>

              {/* Preview of Routines */}
              <Text style={styles.previewRoutinesHeading}>Fichas do seu Treino:</Text>
              {generatedPlan.routines.map((routine, rIdx) => (
                <View key={rIdx} style={styles.previewRoutineCard}>
                  <Text style={styles.previewRoutineTitle}>{routine.name}</Text>
                  <Text style={styles.previewRoutineSubtitle}>{routine.subtitle}</Text>
                  <View style={styles.previewExerciseList}>
                    {routine.exercises.map((ex, exIdx) => (
                      <View key={exIdx} style={styles.previewExItem}>
                        <Text style={styles.previewExNum}>{exIdx + 1}.</Text>
                        <Text style={styles.previewExName}>{ex.exerciseName}</Text>
                        <Text style={styles.previewExSets}>
                          {ex.sets}x ({ex.reps})
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}

              {/* Actions */}
              <TouchableOpacity
                style={styles.savePlanBtn}
                onPress={handleSaveAndStart}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="check-bold" size={20} color={THEME.colors.textInverse} />
                <Text style={styles.savePlanBtnText}>Salvar Plano e Começar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reGenerateBtn}
                onPress={() => setGeneratedPlan(null)}
              >
                <Text style={styles.reGenerateBtnText}>Refazer Configurações</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
    padding: 4,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 40,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(229, 23, 63, 0.35)',
    marginBottom: THEME.spacing.xl,
    gap: 12,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  bannerSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  stepSection: {
    marginBottom: THEME.spacing.xl,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  optionsCol: {
    gap: 10,
  },
  levelOption: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  optionHeader: {
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
  optionLabel: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  optionDesc: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    lineHeight: 16,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  goalOption: {
    width: '48%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    gap: 8,
  },
  goalOptionActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(229, 23, 63, 0.1)',
  },
  goalOptionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  goalOptionLabelActive: {
    color: THEME.colors.text,
    fontWeight: '800',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayBox: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  dayBoxActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primary,
  },
  dayBoxNum: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.text,
  },
  dayBoxNumActive: {
    color: THEME.colors.textInverse,
  },
  dayBoxSub: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  dayBoxSubActive: {
    color: THEME.colors.textInverse,
  },
  equipCol: {
    gap: 8,
  },
  equipItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  equipItemActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(229, 23, 63, 0.08)',
  },
  equipLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  equipLabelActive: {
    color: THEME.colors.primary,
  },
  equipSub: {
    fontSize: 10,
    fontWeight: '500',
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    paddingVertical: 16,
    borderRadius: THEME.borderRadius.lg,
    gap: 8,
    marginTop: THEME.spacing.md,
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.textInverse,
    letterSpacing: 0.3,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.colors.text,
    marginTop: 10,
  },
  previewTagline: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  previewStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  previewStatVal: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.primary,
  },
  previewStatLbl: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  previewRoutinesHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.text,
    alignSelf: 'flex-start',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  previewRoutineCard: {
    width: '100%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 10,
  },
  previewRoutineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  previewRoutineSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  previewExerciseList: {
    gap: 4,
  },
  previewExItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewExNum: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    width: 20,
  },
  previewExName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.text,
  },
  previewExSets: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  savePlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    gap: 8,
    marginTop: THEME.spacing.lg,
  },
  savePlanBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: THEME.colors.textInverse,
  },
  reGenerateBtn: {
    paddingVertical: 12,
  },
  reGenerateBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
});

