FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package.json ./
RUN npm install --only=production && npm cache clean --force

COPY tsconfig.json ./
COPY src ./src/

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/index.js"]
