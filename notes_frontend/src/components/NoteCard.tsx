import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radii, Shadows, Spacing, Typography } from '../theme';

type NoteCardProps = {
  title: string;
  content: string;
  updatedAt: number;
  onPress: () => void;
};

export function NoteCard({ title, content, updatedAt, onPress }: NoteCardProps) {
  const preview =
    content.length > 140 ? content.slice(0, 140).trimEnd() + '…' : content;

  const updated = new Date(updatedAt);
  const timestamp = updated.toLocaleString();

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]} onPress={onPress}>
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.title}>
          {title || 'Untitled'}
        </Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      <Text numberOfLines={3} style={styles.content}>
        {preview}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.soft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.subtitle,
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: Spacing.sm,
  },
  timestamp: {
    ...Typography.small,
  },
  content: {
    ...Typography.body,
    color: Colors.muted,
    lineHeight: 22,
  },
});
