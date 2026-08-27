# Lightweight Dockerfile for Raspberry Pi
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json ./
RUN npm install --only=production && npm cache clean --force

COPY prisma ./prisma/
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src/
RUN npx tsc

FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/admin-panel ./src/admin-panel

ENV NODE_ENV=production
EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/index.js"]
