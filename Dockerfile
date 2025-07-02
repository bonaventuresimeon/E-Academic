# Multi-stage build for production
FROM node:20-alpine AS base

# Install system dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    postgresql-client \
    dumb-init

WORKDIR /app

# Install dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Build the application
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S academic -u 1001 -G nodejs

# Copy built application and dependencies
COPY --from=builder --chown=academic:nodejs /app/dist ./dist
COPY --from=builder --chown=academic:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=academic:nodejs /app/package*.json ./
COPY --from=builder --chown=academic:nodejs /app/uploads ./uploads

# Create necessary directories
RUN mkdir -p /app/uploads && chown -R academic:nodejs /app/uploads

USER academic

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

ENV NODE_ENV=production
ENV PORT=5000

CMD ["dumb-init", "node", "dist/index.js"]