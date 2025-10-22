### Multi-stage Dockerfile for production build
# - build stage: installs deps and compiles TypeScript
# - runtime stage: installs only production deps and runs the compiled JS

FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build --silent

## Runtime image
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production --silent

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Copy any runtime files you need (example: public, views). Do NOT copy .env in the image.
# COPY --from=builder /app/public ./public

EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]
