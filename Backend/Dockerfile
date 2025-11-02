# Stage 1 - Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source and env files
COPY . .
COPY .env.production .env

# Build backend
RUN npm run build

# Stage 2 - Production Image
FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy env file (used at runtime)
COPY .env.production .env

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/index.js"]
