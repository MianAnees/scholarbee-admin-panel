# --- Stage 1: Builder ---------------------------------------------
FROM node:18.8-alpine AS builder

# Install system dependencies for building native modules if needed
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /home/node/app

# Copy just the package files first (improves caching)
COPY package*.json yarn.lock ./

# Install all dependencies (including dev dependencies)
RUN yarn install --frozen-lockfile

# Copy the rest of your source code including src/payload.config.ts
COPY . .

# Build the application
# - If your "build:payload" or "copyfiles" script references src/payload.config.ts,
#   the file must exist at this point.
RUN yarn copyfiles && yarn build:payload && yarn build:server

# If you want to remove dev dependencies after building:
RUN yarn install --production --frozen-lockfile && yarn cache clean

# --- Stage 2: Runtime ---------------------------------------------
FROM node:18.8-alpine AS runtime

# Minimal packages for production
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
# If your compiled config is now at dist/payload.config.js, you might do:
# ENV PAYLOAD_CONFIG_PATH=dist/payload.config.js

WORKDIR /home/node/app

# Copy only the required files from the builder
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/yarn.lock ./

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
