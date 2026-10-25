import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
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
import {
  formatCategory,
  formatEquipment,
  formatLevel,
  formatMuscle,
  getExerciseImageUrl,
  getExerciseVideoSearchUrl,
} from '../data/exercises';
import { Exercise } from '../types';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  visible: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  onAddToWorkout?: (exercise: Exercise) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  visible,
  isFavorite,
  onClose,
  onToggleFavorite,
  onAddToWorkout,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Auto-motion loop animation between start (0.jpg) and finish (1.jpg)
  useEffect(() => {
    let interval: any = null;
    if (isAnimating && exercise && exercise.images.length > 1) {
      interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev === 0 ? 1 : 0));
      }, 1100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnimating, exercise]);

  // Reset image when exercise changes
  useEffect(() => {
    setActiveImageIndex(0);
    setIsAnimating(false);
    setImageError(false);
  }, [exercise]);

  if (!exercise) return null;

  const levelInfo = formatLevel(exercise.level);
  const images = exercise.images || [];
  const currentImagePath = images[activeImageIndex] || images[0];
  const currentImageUrl = currentImagePath ? getExerciseImageUrl(currentImagePath) : null;

  const handleOpenVideo = () => {
    const videoUrl = getExerciseVideoSearchUrl(exercise.name);
    Linking.openURL(videoUrl).catch((err) => {
      console.warn('Could not open video URL', err);
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={THEME.colors.text} />
          </TouchableOpacity>

          <View style={styles.topBarCenter}>
            <Text style={styles.topBarSubtitle}>Ficha do Exercício</Text>
          </View>

          <View style={styles.topBarActions}>
            <TouchableOpacity
              style={[styles.iconButton, isFavorite && styles.favoriteActive]}
              onPress={onToggleFavorite}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? THEME.colors.red : THEME.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Visual Demonstrator Area */}
          <View style={styles.imageViewerCard}>
            <View style={styles.imageWrapper}>
              {currentImageUrl && !imageError ? (
                <Image
                  source={{ uri: currentImageUrl }}
                  style={styles.image}
                  resizeMode="contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <View style={styles.placeholder}>
                  <MaterialCommunityIcons name="dumbbell" size={54} color={THEME.colors.primary} />
                  <Text style={styles.placeholderLabel}>TreineSeuPvt0 • Treino Escuro</Text>
                </View>
              )}

              {/* Status Indicator Pill */}
              <View style={styles.frameBadge}>
                <View style={[styles.pulsingDot, isAnimating && styles.pulsingDotActive]} />
                <Text style={styles.frameBadgeText}>
                  {activeImageIndex === 0 ? 'Fase Inicial (Excêntrica)' : 'Pico de Contração (Concêntrica)'}
                </Text>
              </View>
            </View>

            {/* Frame Controls & Auto-Animation */}
            {images.length > 1 && (
              <View style={styles.controlsRow}>
                <View style={styles.frameSwitchers}>
                  <TouchableOpacity
                    style={[styles.frameBtn, activeImageIndex === 0 && styles.frameBtnActive]}
                    onPress={() => {
                      setIsAnimating(false);
                      setActiveImageIndex(0);
                    }}
                  >
                    <Text
                      style={[
                        styles.frameBtnText,
                        activeImageIndex === 0 && styles.frameBtnTextActive,
                      ]}
                    >
                      Início (1/2)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.frameBtn, activeImageIndex === 1 && styles.frameBtnActive]}
                    onPress={() => {
                      setIsAnimating(false);
                      setActiveImageIndex(1);
                    }}
                  >
                    <Text
                      style={[
                        styles.frameBtnText,
                        activeImageIndex === 1 && styles.frameBtnTextActive,
                      ]}
                    >
                      Pico (2/2)
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Animate Movement Button */}
                <TouchableOpacity
                  style={[styles.animateBtn, isAnimating && styles.animateBtnActive]}
                  onPress={() => setIsAnimating(!isAnimating)}
                >
                  <Ionicons
                    name={isAnimating ? 'pause' : 'play'}
                    size={14}
                    color={isAnimating ? THEME.colors.textInverse : THEME.colors.primary}
                  />
                  <Text
                    style={[
                      styles.animateBtnText,
                      isAnimating && styles.animateBtnTextActive,
                    ]}
                  >
                    {isAnimating ? 'Pausar' : 'Loop Animado'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Exercise Title and Level Banner */}
          <View style={styles.headerSection}>
            <View style={styles.badgeLine}>
              <View style={[styles.levelBadge, { backgroundColor: levelInfo.bg }]}>
                <Text style={[styles.levelBadgeText, { color: levelInfo.color }]}>
                  {levelInfo.label}
                </Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{formatCategory(exercise.category)}</Text>
              </View>
            </View>

            <Text style={styles.exerciseName}>{exercise.name}</Text>
          </View>

          {/* Video Demonstration CTA Banner */}
          <TouchableOpacity
            style={styles.videoBanner}
            onPress={handleOpenVideo}
            activeOpacity={0.8}
          >
            <View style={styles.videoBannerIcon}>
              <Ionicons name="play" size={20} color={THEME.colors.textInverse} />
            </View>
            <View style={styles.videoBannerContent}>
              <Text style={styles.videoBannerTitle}>Ver Vídeo de Execução Correta</Text>
              <Text style={styles.videoBannerSubtitle}>
                Demonstração passo a passo com cadência e postura no YouTube
              </Text>
            </View>
            <Ionicons name="open-outline" size={20} color={THEME.colors.primary} />
          </TouchableOpacity>

          {/* Cadence & Execution Metric */}
          <View style={styles.cadenceCard}>
            <View style={styles.cadenceHeader}>
              <MaterialCommunityIcons name="timer-sand" size={18} color={THEME.colors.primary} />
              <Text style={styles.cadenceTitle}>Cadência Sugerida • TreineSeuPvt0</Text>
            </View>
            <View style={styles.cadenceMetrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>2s</Text>
                <Text style={styles.metricLabel}>Descida (Fase Excêntrica)</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>1s</Text>
                <Text style={styles.metricLabel}>Pausa (Pico de Tensão)</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>2s</Text>
                <Text style={styles.metricLabel}>Subida (Fase Concêntrica)</Text>
              </View>
            </View>
          </View>

          {/* Muscle Anatomy Targets */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Músculos Trabalhados</Text>

            <View style={styles.muscleBlock}>
              <Text style={styles.muscleSubTitle}>Músculos Primários (Alvo Principal):</Text>
              <View style={styles.muscleTagRow}>
                {exercise.primaryMuscles.map((muscle, idx) => (
                  <View key={idx} style={styles.primaryMuscleTag}>
                    <Ionicons name="fitness" size={12} color={THEME.colors.primary} />
                    <Text style={styles.primaryMuscleTagText}>{formatMuscle(muscle)}</Text>
                  </View>
                ))}
              </View>
            </View>

            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
              <View style={styles.muscleBlock}>
                <Text style={styles.muscleSubTitle}>Músculos Secundários (Sinergistas):</Text>
                <View style={styles.muscleTagRow}>
                  {exercise.secondaryMuscles.map((muscle, idx) => (
                    <View key={idx} style={styles.secondaryMuscleTag}>
                      <Text style={styles.secondaryMuscleTagText}>{formatMuscle(muscle)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Equipment & Mechanics Specs Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ficha Técnica</Text>
            <View style={styles.specsGrid}>
              <View style={styles.specCard}>
                <Text style={styles.specKey}>Equipamento</Text>
                <Text style={styles.specValue}>{formatEquipment(exercise.equipment)}</Text>
              </View>
              <View style={styles.specCard}>
                <Text style={styles.specKey}>Mecânica</Text>
                <Text style={styles.specValue}>
                  {exercise.mechanic === 'composto' ? 'Composto (Multi-articular)' : 'Isolado'}
                </Text>
              </View>
              <View style={styles.specCard}>
                <Text style={styles.specKey}>Vetor de Força</Text>
                <Text style={styles.specValue}>
                  {exercise.force === 'push'
                    ? 'Empurrar (Push)'
                    : exercise.force === 'pull'
                    ? 'Puxar (Pull)'
                    : 'Estático / Isometria'}
                </Text>
              </View>
              <View style={styles.specCard}>
                <Text style={styles.specKey}>Dificuldade</Text>
                <Text style={[styles.specValue, { color: levelInfo.color }]}>
                  {levelInfo.label}
                </Text>
              </View>
            </View>
          </View>

          {/* Step-by-Step Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instruções de Execução (Passo a Passo)</Text>
            {exercise.instructions && exercise.instructions.length > 0 ? (
              exercise.instructions.map((step, idx) => (
                <View key={idx} style={styles.instructionStep}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.stepDescription}>{step}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noInstructionsText}>
                Instruções em português disponíveis no vídeo de demonstração acima.
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Bottom Sticky Action Bar */}
        {onAddToWorkout && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.addToWorkoutBtn}
              onPress={() => onAddToWorkout(exercise)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="dumbbell" size={20} color={THEME.colors.textInverse} />
              <Text style={styles.addToWorkoutBtnText}>Adicionar ao Meu Treino</Text>
            </TouchableOpacity>
          </View>
        )}
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
  topBarCenter: {
    alignItems: 'center',
  },
  topBarSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteActive: {
    backgroundColor: 'rgba(255, 51, 75, 0.15)',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 40,
  },
  imageViewerCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  imageWrapper: {
    width: '100%',
    height: 250,
    backgroundColor: '#0F131C',
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  frameBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 14, 20, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.textMuted,
    marginRight: 6,
  },
  pulsingDotActive: {
    backgroundColor: THEME.colors.primary,
  },
  frameBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: THEME.spacing.md,
  },
  frameSwitchers: {
    flexDirection: 'row',
    gap: 6,
  },
  frameBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  frameBtnActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(229, 23, 63, 0.12)',
  },
  frameBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  frameBtnTextActive: {
    color: THEME.colors.primary,
    fontWeight: '800',
  },
  animateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    backgroundColor: 'transparent',
    gap: 5,
  },
  animateBtnActive: {
    backgroundColor: THEME.colors.primary,
  },
  animateBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  animateBtnTextActive: {
    color: THEME.colors.textInverse,
  },
  headerSection: {
    marginBottom: THEME.spacing.lg,
  },
  badgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.colors.text,
    lineHeight: 30,
  },
  videoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    marginBottom: THEME.spacing.lg,
  },
  videoBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.md,
  },
  videoBannerContent: {
    flex: 1,
  },
  videoBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  videoBannerSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  cadenceCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  cadenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: THEME.spacing.md,
  },
  cadenceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cadenceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.colors.primary,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: THEME.colors.border,
  },
  section: {
    marginBottom: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
    letterSpacing: -0.3,
  },
  muscleBlock: {
    marginBottom: THEME.spacing.sm,
  },
  muscleSubTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginBottom: 6,
  },
  muscleTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  primaryMuscleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 23, 63, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(229, 23, 63, 0.3)',
    gap: 5,
  },
  primaryMuscleTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  secondaryMuscleTag: {
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  secondaryMuscleTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specCard: {
    width: '48%',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  specKey: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  instructionStep: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  stepNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.md,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '900',
    color: THEME.colors.textInverse,
  },
  stepDescription: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: THEME.colors.text,
    lineHeight: 20,
  },
  noInstructionsText: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    fontStyle: 'italic',
  },
  bottomBar: {
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
    backgroundColor: THEME.colors.background,
  },
  addToWorkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    gap: 8,
  },
  addToWorkoutBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: THEME.colors.textInverse,
    letterSpacing: 0.3,
  },
});

