# syntax=docker/dockerfile:1

# Backend - Express.js
FROM node:20-alpine

WORKDIR /app

# Install build tools required for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Expose port for Express backend
EXPOSE 3000

# Run the Express server
CMD ["npm", "start"]
