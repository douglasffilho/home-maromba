import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { formatEquipment, formatLevel, formatMuscle, getExerciseImageUrl } from '../data/exercises';
import { Exercise } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isFavorite,
  onPress,
  onToggleFavorite,
}) => {
  const [imageError, setImageError] = useState(false);
  const [useJsdelivr, setUseJsdelivr] = useState(false);

  const levelInfo = formatLevel(exercise.level);
  const primaryMuscle = exercise.primaryMuscles[0] ? formatMuscle(exercise.primaryMuscles[0]) : '';
  const secondaryMuscle = exercise.secondaryMuscles[0] ? formatMuscle(exercise.secondaryMuscles[0]) : null;
  const equipment = formatEquipment(exercise.equipment);

  const imageUrl = exercise.images && exercise.images.length > 0
    ? getExerciseImageUrl(exercise.images[0], useJsdelivr)
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Exercise Thumbnail */}
      <View style={styles.imageContainer}>
        {imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={() => {
              if (!useJsdelivr) {
                setUseJsdelivr(true);
              } else {
                setImageError(true);
              }
            }}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <MaterialCommunityIcons name="dumbbell" size={32} color={THEME.colors.primary} />
            <Text style={styles.placeholderText}>TreineSeuPvt0</Text>
          </View>
        )}

        {/* Video badge indicator */}
        <View style={styles.videoBadge}>
          <Ionicons name="play" size={10} color={THEME.colors.primary} />
          <Text style={styles.videoBadgeText}>Vídeo HD</Text>
        </View>

        {/* Favorite Icon */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleFavorite();
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? THEME.colors.red : THEME.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Exercise Info */}
      <View style={styles.infoContainer}>
        {/* Level and Category Header */}
        <View style={styles.badgeRow}>
          <View style={[styles.levelBadge, { backgroundColor: levelInfo.bg }]}>
            <Text style={[styles.levelText, { color: levelInfo.color }]}>{levelInfo.label}</Text>
          </View>
          <Text style={styles.equipmentText}>• {equipment}</Text>
        </View>

        {/* Exercise Title */}
        <Text style={styles.title} numberOfLines={2}>
          {exercise.name}
        </Text>

        {/* Muscle Targets */}
        <View style={styles.musclesRow}>
          <View style={styles.primaryMuscleBadge}>
            <Text style={styles.primaryMuscleText}>{primaryMuscle}</Text>
          </View>
          {secondaryMuscle && (
            <View style={styles.secondaryMuscleBadge}>
              <Text style={styles.secondaryMuscleText}>+{secondaryMuscle}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Right Arrow */}
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={18} color={THEME.colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceElevated,
    position: 'relative',
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111722',
  },
  placeholderText: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 14, 20, 0.85)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  videoBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  favoriteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(11, 14, 20, 0.75)',
    borderRadius: THEME.borderRadius.full,
    padding: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: THEME.spacing.md,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  equipmentText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginLeft: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  musclesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  primaryMuscleBadge: {
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(229, 23, 63, 0.28)',
  },
  primaryMuscleText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  secondaryMuscleBadge: {
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
  },
  secondaryMuscleText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  arrowContainer: {
    paddingLeft: THEME.spacing.xs,
  },
});

