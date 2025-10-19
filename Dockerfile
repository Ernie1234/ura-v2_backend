# Multi-stage build for optimized production image
FROM node:18-alpine AS base

# Install bun
RUN npm install -g bun

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Development stage
FROM base AS development
RUN bun install --frozen-lockfile
COPY . .
EXPOSE 5000
CMD ["bun", "run", "dev"]

# Build stage
FROM base AS build
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Production stage
FROM node:18-alpine AS production

# Install bun for production
RUN npm install -g bun

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001

WORKDIR /app

# Copy package files and install production dependencies
COPY package.json bun.lockb* ./
RUN bun install --production --frozen-lockfile && \
    bun pm cache rm

# Copy built application
COPY --from=build --chown=backend:nodejs /app/dist ./dist
COPY --from=build --chown=backend:nodejs /app/package.json ./

# Create necessary directories
RUN mkdir -p logs uploads && \
    chown -R backend:nodejs logs uploads

# Switch to non-root user
USER backend

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["bun", "start:prod"]