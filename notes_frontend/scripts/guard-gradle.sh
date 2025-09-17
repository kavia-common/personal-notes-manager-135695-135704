#!/usr/bin/env bash
set -euo pipefail

# This script ensures android/ exists before attempting to run Gradle.
# It prints a helpful error if prebuild hasn't been executed yet.

if [ ! -d "android" ]; then
  echo "Android native project not found. Run: npm run prebuild:android"
  echo "This will generate the android/ folder and Gradle wrapper."
  exit 127
fi

cd android
./gradlew "$@"
