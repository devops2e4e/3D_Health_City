# PulseCity Backend API

Production-grade backend for PulseCity 3D Health Intelligence Platform.

## Features

- ✅ Clean Architecture (Controllers → Services → Models)
- ✅ JWT Authentication & RBAC
- ✅ MongoDB with Geospatial Indexing
- ✅ Coverage & Intelligence Engine
- ✅ Alert Generation System
- ✅ Historical Snapshots
- ✅ TypeScript with Strict Mode
- ✅ Input Validation
- ✅ Centralized Error Handling

## Setup

### Prerequisites

- Node.js 18+
- MongoDB 6+

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
```

### Running

```bash
# Development
npm run dev

# Production
npm run build
npm start

# Tests
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/password` - Update password

### Facilities
- `GET /api/facilities` - Get all facilities
- `GET /api/facilities/:id` - Get facility by ID
- `POST /api/facilities` - Create facility (Admin/Analyst)
- `PUT /api/facilities/:id` - Update facility (Admin/Analyst)
- `DELETE /api/facilities/:id` - Delete facility (Admin)
- `GET /api/facilities/nearby?longitude=X&latitude=Y&radius=Z` - Get nearby facilities
- `GET /api/facilities/:id/history` - Get facility history
- `GET /api/facilities/statistics` - Get system statistics

### Intelligence
- `GET /api/intelligence/coverage` - Analyze coverage
- `GET /api/intelligence/alerts` - Get alerts
- `POST /api/intelligence/alerts/generate` - Generate alerts (Admin/Analyst)
- `PUT /api/intelligence/alerts/:id/acknowledge` - Acknowledge alert

### Users
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/preferences` - Update preferences

## Architecture

```
src/
├── config/          # Configuration & database
├── models/          # Mongoose schemas
├── services/        # Business logic
├── controllers/     # HTTP handlers
├── routes/          # Route definitions
├── middlewares/     # Auth, error handling
├── validators/      # Request validation
└── server.ts        # Entry point
```

## Environment Variables

See `.env.example` for all configuration options.
