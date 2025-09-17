import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors, Shadows } from '../theme';

type FABProps = {
  icon?: string;
  onPress: () => void;
  label?: string;
};

export function FAB({ onPress, label = '+', icon }: FABProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}>
      <Text style={styles.text}>{icon ?? label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 64,
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  text: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginTop: -2,
  },
});
