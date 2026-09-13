FROM node:20-alpine AS deps
WORKDIR /app
COPY packages/plaza-portal/package.json ./packages/plaza-portal/
RUN cd packages/plaza-portal && npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/packages/plaza-portal/node_modules ./packages/plaza-portal/node_modules
COPY packages/plaza-portal/ ./packages/plaza-portal/
RUN cd packages/plaza-portal && npm run build

FROM nginx:alpine AS runtime
RUN apk add --no-cache curl
COPY packages/plaza-portal/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/plaza-portal/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
