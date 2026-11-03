# ============================================
# Этап 1: builder — собираем Vite-приложение
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite по умолчанию собирает в /app/dist
RUN npm run build

# ============================================
# Этап 2: минимальный образ, который умеет
# только копировать dist в примонтированный volume
# ============================================
FROM alpine:latest

# Кладём собранную статику в /app/dist внутри образа
COPY --from=builder /app/dist /app/dist

# CMD выполнится, когда контейнер запустится.
# Он очищает volume и копирует туда свежие файлы.
CMD ["sh", "-c", "rm -rf /shared-dist/* && cp -r /app/dist/* /shared-dist/"]