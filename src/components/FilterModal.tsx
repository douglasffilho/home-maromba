import React from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import {
  CATEGORY_DISPLAY_MAP,
  EQUIPMENT_DISPLAY_MAP,
  MUSCLE_DISPLAY_MAP,
} from '../data/exercises';

export interface FilterState {
  muscle: string | null;
  equipment: string | null;
  level: string | null;
  mechanic: string | null;
  category: string | null;
}

interface FilterModalProps {
  visible: boolean;
  filters: FilterState;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  onClose,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = React.useState<FilterState>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  const toggleFilter = (key: keyof FilterState, val: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: prev[key] === val ? null : val,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const empty = { muscle: null, equipment: null, level: null, mechanic: null, category: null };
    setLocalFilters(empty);
    onResetFilters();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <Ionicons name="close" size={24} color={THEME.colors.text} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Filtros Avançados</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Nível */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nível de Dificuldade</Text>
            <View style={styles.pillsRow}>
              {[
                { id: 'iniciante', label: 'Iniciante', color: THEME.colors.green },
                { id: 'intermediario', label: 'Frequente', color: THEME.colors.yellow },
                { id: 'avancado', label: 'Expert', color: THEME.colors.primary },
              ].map((lvl) => (
                <TouchableOpacity
                  key={lvl.id}
                  style={[
                    styles.pill,
                    localFilters.level === lvl.id && {
                      borderColor: lvl.color,
                      backgroundColor: 'rgba(229, 23, 63, 0.12)',
                    },
                  ]}
                  onPress={() => toggleFilter('level', lvl.id)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      localFilters.level === lvl.id && { color: lvl.color, fontWeight: '800' },
                    ]}
                  >
                    {lvl.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Músculo Principal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Grupo Muscular Principal</Text>
            <View style={styles.pillsRow}>
              {Object.entries(MUSCLE_DISPLAY_MAP).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.pill,
                    localFilters.muscle === key && styles.pillActive,
                  ]}
                  onPress={() => toggleFilter('muscle', key)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      localFilters.muscle === key && styles.pillTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Equipamento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipamento Necessário</Text>
            <View style={styles.pillsRow}>
              {Object.entries(EQUIPMENT_DISPLAY_MAP).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.pill,
                    localFilters.equipment === key && styles.pillActive,
                  ]}
                  onPress={() => toggleFilter('equipment', key)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      localFilters.equipment === key && styles.pillTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mecânica */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mecânica do Movimento</Text>
            <View style={styles.pillsRow}>
              {[
                { id: 'composto', label: 'Composto (Multi-articular)' },
                { id: 'isolado', label: 'Isolado' },
              ].map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.pill,
                    localFilters.mechanic === m.id && styles.pillActive,
                  ]}
                  onPress={() => toggleFilter('mechanic', m.id)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      localFilters.mechanic === m.id && styles.pillTextActive,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Categoria */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoria de Exercício</Text>
            <View style={styles.pillsRow}>
              {Object.entries(CATEGORY_DISPLAY_MAP).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.pill,
                    localFilters.category === key && styles.pillActive,
                  ]}
                  onPress={() => toggleFilter('category', key)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      localFilters.category === key && styles.pillTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Apply Action */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.8}>
            <Text style={styles.applyBtnText}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>
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
  iconBtn: {
    padding: 4,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  resetText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.red,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 40,
  },
  section: {
    marginBottom: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  pillActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(229, 23, 63, 0.14)',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  pillTextActive: {
    color: THEME.colors.primary,
    fontWeight: '800',
  },
  bottomBar: {
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
    backgroundColor: THEME.colors.background,
  },
  applyBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: THEME.colors.textInverse,
  },
});

