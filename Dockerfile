# Stage 1: Build Frontend
FROM node:18-slim AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
# Fix for Rollup/Vite compatibility on different platforms
RUN npm install
RUN npm install @rollup/rollup-linux-x64-gnu
COPY client/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:18-slim AS backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:18-slim
WORKDIR /app
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/package*.json ./
COPY --from=frontend-builder /app/client/dist ./client/dist

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000
ENV NODE_ENV=production
CMD ["npm", "start"]
