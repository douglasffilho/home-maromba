import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseCard } from '../components/ExerciseCard';
import { FilterModal, FilterState } from '../components/FilterModal';
import { THEME } from '../constants/theme';
import { EXERCISES, QUICK_LEVEL_FILTERS, QUICK_MUSCLE_FILTERS } from '../data/exercises';
import { Exercise } from '../types';

interface ExercisesScreenProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const ExercisesScreen: React.FC<ExercisesScreenProps> = ({
  favorites,
  onToggleFavorite,
  onSelectExercise,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState('all');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    muscle: null,
    equipment: null,
    level: null,
    mechanic: null,
    category: null,
  });

  // Count active advanced filters
  const activeAdvancedFilterCount = useMemo(() => {
    return Object.values(advancedFilters).filter(Boolean).length;
  }, [advancedFilters]);

  // Fast memoized search & filter logic across 873 exercises
  const filteredExercises = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return EXERCISES.filter((ex) => {
      // 1. Text Search query (Name, muscles, equipment, id)
      if (q) {
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesMuscle = ex.primaryMuscles.some((m) => m.toLowerCase().includes(q));
        const matchesEquipment = ex.equipment?.toLowerCase().includes(q);
        if (!matchesName && !matchesMuscle && !matchesEquipment) {
          return false;
        }
      }

      // 2. Quick Muscle Filter
      if (selectedMuscleFilter !== 'all') {
        const hasMuscle = ex.primaryMuscles.includes(selectedMuscleFilter) ||
          ex.secondaryMuscles?.includes(selectedMuscleFilter);
        if (!hasMuscle) return false;
      }

      // 3. Quick Level Filter
      if (selectedLevelFilter !== 'all') {
        if (ex.level !== selectedLevelFilter) return false;
      }

      // 4. Advanced Filters
      if (advancedFilters.muscle) {
        const hasMuscle = ex.primaryMuscles.includes(advancedFilters.muscle) ||
          ex.secondaryMuscles?.includes(advancedFilters.muscle);
        if (!hasMuscle) return false;
      }

      if (advancedFilters.equipment && ex.equipment !== advancedFilters.equipment) {
        return false;
      }

      if (advancedFilters.level && ex.level !== advancedFilters.level) {
        return false;
      }

      if (advancedFilters.mechanic && ex.mechanic !== advancedFilters.mechanic) {
        return false;
      }

      if (advancedFilters.category && ex.category !== advancedFilters.category) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedMuscleFilter, selectedLevelFilter, advancedFilters]);

  return (
    <View style={styles.container}>
      {/* Search Bar & Filter Button Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search" size={18} color={THEME.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, músculo ou aparelho..."
            placeholderTextColor={THEME.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={18} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Trigger Button */}
        <TouchableOpacity
          style={[styles.filterTrigger, activeAdvancedFilterCount > 0 && styles.filterTriggerActive]}
          onPress={() => setIsFilterModalOpen(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeAdvancedFilterCount > 0 ? THEME.colors.textInverse : THEME.colors.text}
          />
          {activeAdvancedFilterCount > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{activeAdvancedFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Muscle Horizontal Pills */}
      <View style={styles.pillsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={QUICK_MUSCLE_FILTERS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.horizontalPillsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.quickPill,
                selectedMuscleFilter === item.id && styles.quickPillActive,
              ]}
              onPress={() => setSelectedMuscleFilter(item.id)}
            >
              <Text
                style={[
                  styles.quickPillText,
                  selectedMuscleFilter === item.id && styles.quickPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Quick Level Sub-pills */}
      <View style={styles.levelFilterRow}>
        {QUICK_LEVEL_FILTERS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.levelFilterItem,
              selectedLevelFilter === item.id && styles.levelFilterItemActive,
            ]}
            onPress={() => setSelectedLevelFilter(item.id)}
          >
            <Text
              style={[
                styles.levelFilterText,
                selectedLevelFilter === item.id && styles.levelFilterTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results Header Count */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsCountText}>
          {filteredExercises.length}{' '}
          <Text style={{ color: THEME.colors.textMuted }}>
            {filteredExercises.length === 1 ? 'exercício encontrado' : 'exercícios encontrados'}
          </Text>
        </Text>
        {(searchQuery || selectedMuscleFilter !== 'all' || selectedLevelFilter !== 'all' || activeAdvancedFilterCount > 0) && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              setSelectedMuscleFilter('all');
              setSelectedLevelFilter('all');
              setAdvancedFilters({ muscle: null, equipment: null, level: null, mechanic: null, category: null });
            }}
          >
            <Text style={styles.clearAllFiltersText}>Limpar Tudo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Exercises FlatList */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseCard
            exercise={item}
            isFavorite={favorites.includes(item.id)}
            onPress={() => onSelectExercise(item)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={THEME.colors.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum exercício encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Tente buscar por outro termo ou remova os filtros ativos.
            </Text>
          </View>
        }
      />

      {/* Advanced Filter Modal */}
      <FilterModal
        visible={isFilterModalOpen}
        filters={advancedFilters}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={setAdvancedFilters}
        onResetFilters={() =>
          setAdvancedFilters({
            muscle: null,
            equipment: null,
            level: null,
            mechanic: null,
            category: null,
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    gap: 10,
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: THEME.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  filterTrigger: {
    width: 46,
    height: 46,
    borderRadius: THEME.borderRadius.lg,
    backgroundColor: THEME.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    position: 'relative',
  },
  filterTriggerActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: THEME.colors.red,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeCountText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFF',
  },
  pillsContainer: {
    marginVertical: 4,
  },
  horizontalPillsList: {
    paddingHorizontal: THEME.spacing.lg,
    gap: 8,
    paddingVertical: 4,
  },
  quickPill: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  quickPillActive: {
    backgroundColor: 'rgba(229, 23, 63, 0.16)',
    borderColor: THEME.colors.primary,
  },
  quickPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  quickPillTextActive: {
    color: THEME.colors.primary,
    fontWeight: '800',
  },
  levelFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 6,
    gap: 8,
  },
  levelFilterItem: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surfaceElevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  levelFilterItemActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(229, 23, 63, 0.14)',
  },
  levelFilterText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  levelFilterTextActive: {
    color: THEME.colors.primary,
    fontWeight: '800',
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 8,
  },
  resultsCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  clearAllFiltersText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.red,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 4,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
});

