import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import NotesListScreen from '../screens/NotesListScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Colors } from '../theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Route =
  | { name: 'list' }
  | { name: 'detail'; id?: number | null }
  | { name: 'settings' };

export default function RootNavigator() {
  const [route, setRoute] = useState<Route>({ name: 'list' });

  const goTo = (r: Route) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRoute(r);
  };

  const screen = useMemo(() => {
    switch (route.name) {
      case 'list':
        return (
          <NotesListScreen
            onOpenNote={(id) => goTo({ name: 'detail', id })}
            onCreateNote={() => goTo({ name: 'detail', id: null })}
            onChangeTab={(k) => goTo(k === 'settings' ? { name: 'settings' } : { name: 'list' })}
          />
        );
      case 'detail':
        return (
          <NoteDetailScreen
            noteId={route.id ?? undefined}
            onBack={() => goTo({ name: 'list' })}
          />
        );
      case 'settings':
        return <SettingsScreen />;
      default:
        return null;
    }
  }, [route]);

  return <View style={styles.container}>{screen}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
});
