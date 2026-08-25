FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY packages/simulator/package.json ./packages/simulator/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN cd packages/shared && npm run build
RUN cd packages/simulator && npm run build

FROM base AS runtime
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/simulator/dist ./packages/simulator/dist
COPY --from=build /app/packages/simulator/package.json ./packages/simulator/
EXPOSE 3000
CMD ["node", "packages/simulator/dist/cli.js", "simulate", "--count", "10", "--interval", "3000"]
