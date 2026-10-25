import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export type TabType = 'treinos' | 'exercicios' | 'progresso';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      {/* Tab 1: Treinos & Planos */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('treinos')}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="dumbbell"
          size={24}
          color={activeTab === 'treinos' ? THEME.colors.primary : THEME.colors.textMuted}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'treinos' && styles.tabLabelActive,
          ]}
        >
          Planos
        </Text>
        {activeTab === 'treinos' && <View style={styles.indicator} />}
      </TouchableOpacity>

      {/* Tab 2: Exercícios & Busca */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('exercicios')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="search"
          size={22}
          color={activeTab === 'exercicios' ? THEME.colors.primary : THEME.colors.textMuted}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'exercicios' && styles.tabLabelActive,
          ]}
        >
          Exercícios
        </Text>
        {activeTab === 'exercicios' && <View style={styles.indicator} />}
      </TouchableOpacity>

      {/* Tab 3: Progresso & Stats */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('progresso')}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="fire"
          size={24}
          color={activeTab === 'progresso' ? THEME.colors.streak : THEME.colors.textMuted}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'progresso' && [styles.tabLabelActive, { color: THEME.colors.streak }],
          ]}
        >
          Progresso
        </Text>
        {activeTab === 'progresso' && (
          <View style={[styles.indicator, { backgroundColor: THEME.colors.streak }]} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: THEME.colors.background,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  tabLabelActive: {
    color: THEME.colors.primary,
    fontWeight: '800',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 3,
    backgroundColor: THEME.colors.primary,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});

