import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Header } from '../components/Header';
import { Colors, Spacing } from '../theme';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Header title="Settings" />
      <View style={styles.body}>
        <Text style={styles.text}>Settings are not available in this demo.</Text>
        <Text style={styles.textMuted}>Use the bottom navigation to return to Notes.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  body: {
    padding: Spacing.lg,
  },
  text: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  textMuted: {
    color: '#64748B',
  },
});
