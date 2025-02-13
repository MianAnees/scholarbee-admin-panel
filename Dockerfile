# --- Stage 1: Builder ---------------------------------------------
FROM node:18.8-alpine AS builder

# Install system dependencies for building native modules if needed
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /home/node/app

# Verify Node.js and npm versions
RUN node --version && npm --version

# Copy just the package files first (improves caching)
COPY package.json ./

# Debug: Show package files before installation
RUN cat package.json && echo "----" && cat package.json

# Install all dependencies including dev dependencies
RUN npm install --prefer-offline --no-audit --progress=false

# Copy the rest of your source code
COPY . .

# Debug: List installed node modules
RUN ls -lah node_modules

# Build the application
RUN npm run copyfiles && npm run build:payload && npm run build:server

# Remove dev dependencies after building
RUN npm prune --production && npm cache clean --force

# --- Stage 2: Runtime ---------------------------------------------
FROM node:18.8-alpine AS runtime

# Minimal packages for production
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production

WORKDIR /home/node/app

# Copy only necessary files from builder
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/package.json ./
COPY --from=builder /home/node/app/package-lock.json ./

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
