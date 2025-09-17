import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TextInput, Text } from 'react-native';
import { Header } from '../components/Header';
import { FAB } from '../components/FAB';
import { NoteCard } from '../components/NoteCard';
import { BottomNav } from '../components/BottomNav';
import { Colors, Radii, Shadows, Spacing } from '../theme';
import { listNotes, Note } from '../storage/db';

type Props = {
  onOpenNote: (noteId: number) => void;
  onCreateNote: () => void;
  onChangeTab: (key: 'notes' | 'settings') => void;
};

export default function NotesListScreen({ onOpenNote, onCreateNote, onChangeTab }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const loadNotes = useCallback(async () => {
    try {
      const all = await listNotes();
      setNotes(all);
    } catch (e) {
      console.warn('Failed to load notes:', e);
      setNotes([]); // prevent crash/blank UI
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  }, [loadNotes]);

  const filtered = notes.filter(n => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  return (
    <View style={styles.container}>
      <Header title="My Notes" />
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Search notes..."
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptyText}>Tap the + button to create your first note.</Text>
          </View>
        ) : (
          filtered.map(n => (
            <NoteCard
              key={n.id}
              title={n.title}
              content={n.content}
              updatedAt={n.updated_at}
              onPress={() => onOpenNote(n.id!)}
            />
          ))
        )}
      </ScrollView>
      <FAB onPress={onCreateNote} />
      <BottomNav active="notes" onChange={onChangeTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: 120 },
  searchWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  search: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    ...Shadows.soft,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 6,
  },
  emptyText: {
    color: '#64748B',
  },
});
