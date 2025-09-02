# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install curl for health checks
RUN apk add --no-cache curl

# Install pnpm for production
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy everything from builder
COPY --from=builder /app ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
