<p align="center">
  <img src="../assets/icon.png" alt="Mobile App" width="100" />
</p>

<h1 align="center">Trucking Mobile</h1>

<p align="center">
  React Native mobile app for drivers and dispatchers
</p>

---

## 📱 Features

- **Role-based Views**: Admin, Dispatcher, Driver, and Customer perspectives
- **Load Tracking**: Real-time GPS tracking and status updates
- **Messaging**: Instant chat with Socket.IO
- **Offline Support**: AsyncStorage for local caching
- **Native Performance**: Expo bare workflow for full native access

## 🏗️ Tech Stack

| Technology | Version |
|------------|---------|
| **React Native** | 0.85.3 |
| **Expo** | ~56.0.12 |
| **Navigation** | React Navigation v7 |
| **Socket.IO** | Real-time client |
| **AsyncStorage** | Offline storage |

## 📁 Project Structure

```
mobile/
├── src/
│   ├── app/                # Entry point & navigation
│   ├── lib/
│   │   ├── api/client.ts   # API client
│   │   └── auth-session.ts # Auth hooks
│   ├── features/
│   │   ├── auth/         # Login/signup
│   │   ├── loads/        # Load tracking
│   │   └── dispatches/   # Dispatch views
├── ios/                  # iOS native project
├── android/              # Android native project
└── app.json              # Expo config
```

## 🚀 Quick Start

```bash
# From project root
pnpm install

# Start Metro bundler
pnpm dev:mobile

# Run on iOS (requires Xcode)
pnpm run:ios

# Run on Android (requires SDK)
pnpm run:android
```

### iOS Setup

```bash
cd ios
pod install
```

## 🔧 Configuration

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## 📄 License

MIT License