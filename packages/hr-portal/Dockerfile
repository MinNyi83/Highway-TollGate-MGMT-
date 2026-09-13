FROM node:20-alpine AS deps
WORKDIR /app
COPY packages/hr-portal/package.json ./packages/hr-portal/
RUN cd packages/hr-portal && npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/packages/hr-portal/node_modules ./packages/hr-portal/node_modules
COPY packages/hr-portal/ ./packages/hr-portal/
RUN cd packages/hr-portal && npm run build

FROM nginx:alpine AS runtime
RUN apk add --no-cache curl
COPY packages/hr-portal/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/hr-portal/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
