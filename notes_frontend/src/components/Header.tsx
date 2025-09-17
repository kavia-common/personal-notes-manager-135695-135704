import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Gradients, Radii, Shadows, Spacing, Typography } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

type HeaderProps = {
  title: string;
  right?: React.ReactNode;
};

export function Header({ title, right }: HeaderProps) {
  return (
    <LinearGradient colors={Gradients.header} style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.right}>{right}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 58,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadows.soft,
    borderBottomLeftRadius: Radii.lg,
    borderBottomRightRadius: Radii.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    marginLeft: 'auto',
  },
  title: {
    ...Typography.title,
  },
});
