FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src/ ./src/

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/uploads /app/backups

EXPOSE 3000

CMD ["node", "dist/main.js"]
