import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { Colors } from './src/theme';

/**
 * App entry point for the Notes app following the Ocean Professional style guide.
 * Renders the RootNavigator that handles the entire flow: list, details, and settings.
 */
export default function App() {
  // Basic mount log to help diagnose "blank screen" in previews/console
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('App mounted: rendering RootNavigator');
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <RootNavigator />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Wrapper ensures full height on web environments where SafeAreaView may not fill by default
  root: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
