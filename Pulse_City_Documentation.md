# PulseCity 3D Health Intelligence Platform Documentation

## 1. Project Overview
PulseCity is a production-grade 3D health intelligence platform designed for urban healthcare management and spatial analysis. It provides real-time visibility into healthcare facility status, metropolitan coverage gaps, and predictive alerts to ensure efficient health service delivery.

### Mission
To empower city administrators and health officials with data-driven insights through a digital twin of the city's health infrastructure.

---

## 2. System Architecture
PulseCity follows a modern Client-Server architecture:

- **Frontend (Digital Twin/Client)**: A React-based 3D interface that visualizes the city and its health facilities. It uses Three.js for rendering and Zustand for state management.
- **Backend (API Server)**: A Node.js/Express server that handles business logic, intelligence analysis, and data persistence using MongoDB.
- **Intelligence Engine**: A dedicated service layer that analyzes coverage, detects underserved zones, and generates automated alerts based on capacity thresholds.

---

## 3. Technical Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose (Geospatial indexing enabled)
- **Security**: JWT (JSON Web Tokens) & Bcrypt for RBAC
- **Validation**: Express-validator
- **Testing**: Jest

### Frontend
- **Framework**: React (Vite)
- **Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Animations**: GSAP, Framer Motion
- **Icons**: Lucide-React

---

## 4. Key Features

### 🏢 3D Digital Twin
- Real-time visualization of health facilities in a 3D city scene.
- Interactive facility markers with status-based coloring (Healthy vs. Critical).
- Detailed side panel for individual facility metrics.

### 🧠 Intelligence & Analytics
- **Coverage Analysis**: Detects "health deserts" (underserved zones) using geospatial grid sampling.
- **Load Monitoring**: Real-time tracking of facility capacity and overcapacity detection.
- **Automated Alerts**: Generates high-priority notifications when load thresholds are exceeded.

### 🛡️ Security & RBAC
- Role-Based Access Control:
    - **Viewer**: Read-only access to dashboard and analytics.
    - **Analyst**: Can generate reports and manage alerts.
    - **Admin**: Full system management, including facility and user administration.

---

## 5. Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- npm or yarn

### Backend Setup
1. Navigate to the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your MONGODB_URI and JWT_SECRET
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `client` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

---

## 6. API Documentation

### Authentication
- `POST /api/auth/register` - New account creation.
- `POST /api/auth/login` - Authenticate and receive JWT.
- `GET /api/auth/me` - Current session validation.

### Facilities
- `GET /api/facilities` - Fetch all metropolitan health facilities.
- `POST /api/facilities` - Register a new facility (Admin/Analyst).
- `GET /api/facilities/:id/history` - Retrieve historical load data.
- `GET /api/facilities/statistics` - Aggregate system-wide metrics.

### Intelligence
- `GET /api/intelligence/coverage` - Trigger spatial coverage analysis.
- `GET /api/intelligence/alerts` - List active system alerts.
- `POST /api/intelligence/alerts/generate` - Manual alert generation trigger.

---

## 7. Project Structure

### Backend (`src/`)
- `models/`: Mongoose schemas (User, Facility, Alert, Snapshot).
- `services/`: Core logic (IntelligenceService, FacilityService).
- `controllers/`: HTTP request handlers.
- `middlewares/`: Auth, error handling, and validation filters.

### Frontend (`client/src/`)
- `components/`: Reusable UI and 3D components (CityScene, StatsCards).
- `pages/`: Primary application views (Dashboard, Analytics, Alerts).
- `store/`: Zustand global state definitions.
- `lib/`: API clients and utility functions.

---

## 8. Development Commands
- `npm run lint`: Run ESLint across the project.
- `npm run build`: Generate production bundles.
- `npm run test`: Execute backend test suite.
