# ---------- Base Stage ----------
FROM node:20-alpine AS base

# Install dependencies for native Node modules and runtime needs
RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  sqlite \
  postgresql-client \
  dumb-init

# Create working directory
WORKDIR /app

# ---------- Dependencies Stage ----------
FROM base AS deps

COPY package*.json ./
RUN npm ci --legacy-peer-deps && npm cache clean --force

# ---------- Build Stage ----------
FROM base AS builder

WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure the uploads directory exists
RUN mkdir -p uploads

# Build the application
RUN npm run build

# ---------- Runtime Stage ----------
FROM base AS runner

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S academic -u 1001 -G nodejs

WORKDIR /app

# Copy built application and node_modules with proper ownership
COPY --from=builder --chown=academic:nodejs /app/dist ./dist
COPY --from=builder --chown=academic:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=academic:nodejs /app/package*.json ./
COPY --from=builder --chown=academic:nodejs /app/uploads ./uploads

# Recreate uploads directory and fix permissions
RUN mkdir -p /app/uploads && chown -R academic:nodejs /app/uploads

# Use non-root user
USER academic

# Expose app port (Fly defaults to 8080 internally)
EXPOSE 8080

# Environment
ENV NODE_ENV=production
ENV PORT=8080

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost:8080/api/health || exit 1

# Run the app
CMD ["dumb-init", "node", "dist/index.js"]