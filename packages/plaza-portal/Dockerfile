FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/plaza-portal/package.json ./packages/plaza-portal/
RUN npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN cd packages/shared && npm run build
RUN cd packages/plaza-portal && npm run build

FROM nginx:alpine AS runtime
RUN apk add --no-cache curl
COPY packages/plaza-portal/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/plaza-portal/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
