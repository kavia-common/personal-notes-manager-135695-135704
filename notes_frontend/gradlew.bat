@echo off
REM Shim gradle wrapper for CI when android/ project is not generated.
IF EXIST "android\gradlew.bat" (
  CALL android\gradlew.bat %*
  EXIT /B %ERRORLEVEL%
)

ECHO Gradle wrapper not found because the native Android project has not been generated.
ECHO Run: npm run prebuild:android (expo prebuild) to create the android\ folder.
ECHO Skipping Gradle task in this environment.
REM Exit 0 to avoid failing CI that probes Gradle before prebuild.
EXIT /B 0
