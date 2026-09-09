FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/financial-portal/package.json ./packages/financial-portal/
RUN npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/packages/financial-portal/node_modules ./packages/financial-portal/node_modules
COPY . .
RUN cd packages/shared && npm run build
RUN cd packages/financial-portal && npm run build

FROM nginx:alpine AS runtime
RUN apk add --no-cache curl
COPY packages/financial-portal/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/financial-portal/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
