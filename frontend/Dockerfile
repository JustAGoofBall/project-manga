# syntax=docker/dockerfile:1

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend code
COPY frontend .

# Build React app
RUN npm run build

# Production stage - serve with lightweight server
FROM node:20-alpine

WORKDIR /app

# Install serve to run the built React app
RUN npm install -g serve

# Copy built app from build stage
COPY --from=build /app/dist ./dist

# Expose port for React frontend
EXPOSE 5173

# Serve the React app
CMD ["serve", "-s", "dist", "-l", "5173"]
