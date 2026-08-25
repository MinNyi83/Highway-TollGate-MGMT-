FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY packages/customer-portal/package.json ./packages/customer-portal/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN cd packages/shared && npm run build
RUN cd packages/customer-portal && npm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/packages/customer-portal/dist /usr/share/nginx/html
COPY packages/customer-portal/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
