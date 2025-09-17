import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { Colors } from './src/theme';

/**
 * App entry point for the Notes app following the Ocean Professional style guide.
 * Renders the RootNavigator that handles the entire flow: list, details, and settings.
 */
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <RootNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
