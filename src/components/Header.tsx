import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { FitnessLevel, UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
  onLevelPress: () => void;
  onStatsPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ stats, onLevelPress, onStatsPress }) => {
  const levelLabels: Record<FitnessLevel, { label: string; color: string }> = {
    iniciante: { label: '1', color: THEME.colors.green },
    frequente: { label: '2', color: THEME.colors.yellow },
    expert: { label: '3', color: THEME.colors.primary },
  };

  const currentLevel = levelLabels[stats.selectedLevel] || levelLabels.frequente;

  return (
    <View style={styles.container}>
      {/* Brand title */}
      <View>
        <View style={styles.brandRow}>
          <MaterialCommunityIcons name="lightning-bolt" size={24} color={THEME.colors.primary} />
          <Text style={styles.brandTitle}>
            TREINE <Text style={styles.brandHighlight}>SEU PVT0</Text>
          </Text>
        </View>
        <Text style={styles.brandSubtitle}>Treino & Performance • Dark Mode</Text>
      </View>

      {/* Right stats and level */}
      <View style={styles.actionsRow}>
        {/* Streak counter */}
        <TouchableOpacity
          style={styles.streakBadge}
          onPress={onStatsPress}
          activeOpacity={0.7}
        >
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakCount}>{stats.streak}</Text>
        </TouchableOpacity>

        {/* Level pill */}
        <TouchableOpacity
          style={[styles.levelPill, { borderColor: currentLevel.color }]}
          onPress={onLevelPress}
          activeOpacity={0.8}
        >
          <View style={[styles.levelDot, { backgroundColor: currentLevel.color }]} />
          <Text style={[styles.levelText, { color: currentLevel.color }]}>
            {currentLevel.label}
          </Text>
          <Ionicons name="chevron-down" size={12} color={currentLevel.color} style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.md,
    backgroundColor: THEME.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.colors.text,
    letterSpacing: 0.5,
  },
  brandHighlight: {
    color: THEME.colors.primary,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 31, 0.3)',
  },
  streakIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  streakCount: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.streak,
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1.5,
  },
  levelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

