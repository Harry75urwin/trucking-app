<p align="center">
  <img src="https://vitejs.dev/logo.svg" alt="Vite" width="100" />
</p>

<h1 align="center">Trucking Web Dashboard</h1>

<p align="center">
  Modern React dashboard for fleet management and analytics
</p>

---

## ✨ Features

- **Interactive Dashboard**: Real-time stats and overview
- **Load Management**: Create, filter, and track loads
- **Data Tables**: Powerful grids with TanStack Table
- **Charts**: Visualization with Recharts
- **Messaging**: Real-time chat interface
- **Role-based UI**: Different views for each user type

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vite** 7.x | Build tool |
| **React** 19.x | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** 4.x | Styling |
| **Radix UI** | Component primitives |
| **TanStack Table** | Data tables |
| **Socket.IO** | Real-time updates |

## 📁 Project Structure

```
web/
├── lib/
│   ├── backend-api.ts    # API client
│   ├── auth-session.ts   # Auth management
│   └── components/       # Shared components
├── src/
│   ├── routes/           # Page components
│   ├── layouts/          # Layout wrappers
│   └── main.tsx          # Entry point
├── public/               # Static assets
└── vite.config.ts
```

## 🚀 Quick Start

```bash
# From project root
pnpm install

# Start development server
pnpm dev:web

# Build for production
pnpm build:web
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev:web` | Start dev server (port 5173) |
| `pnpm build:web` | Production build |
| `pnpm typecheck` | Run TypeScript check |
| `pnpm lint:web` | Lint code |

## 🔧 Configuration

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 📊 Key Components

- **Load Board**: Filterable load table
- **Dashboard**: Stats and analytics
- **Messaging**: Chat interface
- **Tracking Map**: GPS visualization

## 📄 License

MIT License