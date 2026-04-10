FROM node:20-alpine AS base

# Install dependencies
WORKDIR /app
COPY package.json package-lock.json ./

# First try npm ci, fallback to npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --only=production || npm install --only=production; \
    else \
      npm install --only=production; \
    fi

# Copy app source
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Create production image
FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
