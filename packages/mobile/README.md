# Mobile App

React Native mobile app using Expo bare workflow.

## Development

```bash
# Start Metro bundler
pnpm dev:mobile

# Run iOS (requires Xcode)
pnpm run:ios

# Run Android (requires Android SDK/emulator)
pnpm run:android
```

## Notes

- Native projects are in `ios/` and `android/` directories
- iOS requires CocoaPods (installed via `pod install` in `ios/` directory)
- Android requires Android SDK setup