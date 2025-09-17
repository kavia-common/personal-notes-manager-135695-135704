import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Header } from '../components/Header';
import { Colors, Radii, Shadows, Spacing } from '../theme';
import { createNote, deleteNote, getNote, updateNote } from '../storage/db';

type Props = {
  noteId?: number | null;
  onBack: () => void;
};

export default function NoteDetailScreen({ noteId, onBack }: Props) {
  const isNew = !noteId;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isNew && noteId) {
        const n = await getNote(noteId);
        if (mounted && n) {
          setTitle(n.title);
          setContent(n.content);
        }
      } else {
        setTitle('');
        setContent('');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isNew, noteId]);

  const canSave = useMemo(() => title.trim().length > 0 || content.trim().length > 0, [title, content]);

  const handleSave = async () => {
    try {
      if (!canSave) {
        onBack();
        return;
      }
      if (isNew) {
        await createNote(title.trim() || 'Untitled', content.trim());
      } else if (noteId) {
        await updateNote(noteId, title.trim() || 'Untitled', content.trim());
      }
      onBack();
    } catch {
      Alert.alert('Error', 'Failed to save note.');
    }
  };

  const handleDelete = async () => {
    if (isNew || !noteId) {
      onBack();
      return;
    }
    Alert.alert('Delete note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNote(noteId);
            onBack();
          } catch {
            Alert.alert('Error', 'Failed to delete note.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header
        title={isNew ? 'New Note' : 'Edit Note'}
        right={
          <View style={{ flexDirection: 'row' }}>
            {!isNew && (
              <Pressable style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]} onPress={handleDelete}>
                <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
              </Pressable>
            )}
            <Pressable
              style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }, !canSave && styles.actionDisabled]}
              onPress={handleSave}
            >
              <Text style={styles.actionText}>Save</Text>
            </Pressable>
          </View>
        }
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.bodyInput}
          placeholder="Start typing..."
          placeholderTextColor="#94A3B8"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: 140 },
  action: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.15)',
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
  },
  titleInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.soft,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  bodyInput: {
    minHeight: 320,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.soft,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: Colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
});
