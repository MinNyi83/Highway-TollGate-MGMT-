FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN cd packages/shared && npm run build
RUN cd packages/frontend && npm run build

FROM nginx:alpine AS runtime
RUN apk add --no-cache curl
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html
COPY FINANCIAL_REPORT.html /usr/share/nginx/html/FINANCIAL_REPORT.html
COPY PRESENTATION.html /usr/share/nginx/html/presentation.html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
