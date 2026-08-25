FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN cd packages/shared && npm run build
RUN cd packages/backend && npx prisma generate
RUN cd packages/backend && npm run build

FROM base AS runtime
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/backend/dist ./packages/backend/dist
COPY --from=build /app/packages/backend/prisma ./packages/backend/prisma
COPY --from=build /app/packages/backend/package.json ./packages/backend/
RUN mkdir -p uploads
EXPOSE 3000
CMD ["sh", "-c", "cd packages/backend && npx prisma migrate deploy && cd /app && node packages/backend/dist/server.js"]
