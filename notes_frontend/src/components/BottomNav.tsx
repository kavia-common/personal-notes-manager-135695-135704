import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '../theme';

type TabKey = 'notes' | 'settings';

type BottomNavProps = {
  active: TabKey;
  onChange: (key: TabKey) => void;
};

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <View style={styles.nav}>
      <NavItem
        label="Notes"
        active={active === 'notes'}
        onPress={() => onChange('notes')}
      />
      <NavItem
        label="Settings"
        active={active === 'settings'}
        onPress={() => onChange('settings')}
      />
    </View>
  );
}

function NavItem({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        active && styles.itemActive,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.itemText, active && styles.itemTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: 16,
    height: 60,
    backgroundColor: Colors.surface,
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
    paddingHorizontal: Spacing.sm,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radii.pill,
  },
  itemActive: {
    backgroundColor: '#EFF6FF',
  },
  itemText: {
    color: '#475569',
    fontWeight: '600',
  },
  itemTextActive: {
    color: Colors.primary,
  },
});
