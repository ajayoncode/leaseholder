![Blocks Online Logo](https://myblockonline.co.uk/rel3/application/images/admin/default-logo_branding.png)

# Blocks Online Mobile App (Android / iOS)

## Installation

### Node.js dependencies

```bash
npm install
```

### Install iOS libraries (MacOS only)

Please make sure you have XCode installed

```bash
sudo gem install cocoapods
npx pod-install
```

### Install Android

Please make sure you have Android Studio installed

---

### Run Android or iOS development version

```bash
npx react-native run-ios # Run iOS app
npx react-native run-android # Run Android app
```

---

## Release Build

### Android

Before the release please update ``versionCode`` in [android/app/build.gradle](android/app/build.gradle) like so:

```gradle
   defaultConfig {
        ...
        versionCode 1 // BUMP ME UP TO 2, 3, 4 etc.!
        versionName "1.0.0" // Human-readable version. Please follow semantic versioning!
    }
```

Then, generate Android bundle package:

```bash
cd android

# Produce APK (mostly useful for testing)
./gradlew assembleRelease

# Produce AAB (for Google Play Store release)
./gradlew bundleRelease
```

The generated AAB can be found under android/app/build/outputs/bundle/release/app-release.aab, and is ready to be uploaded to Google Play.

### iOS Release

```bash
???
```

---

## Notes

### Generate Android debug keystore

```bash
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
```

### Generate Android upload keystore

```bash
keytool -genkey -v -keystore release.keystore -alias release-alias -keyalg RSA -keysize 2048 -validity 10000
```
