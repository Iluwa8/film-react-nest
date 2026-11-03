# ============================================
# Этап 1: builder — здесь мы собираем TypeScript в JS
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем только манифесты, чтобы использовать кэш слоёв Docker.
# Если package.json не менялся, npm ci не будет перезапускаться.
COPY package*.json ./

# npm ci — детерминированная установка строго по package-lock.json
RUN npm ci

# Теперь копируем весь исходный код
COPY . .

# Собираем проект: tsc превращает src/*.ts в dist/*.js
RUN npm run build

# ============================================
# Этап 2: production — только то, что нужно для запуска
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Копируем манифесты и ставим ТОЛЬКО прод-зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Забираем из builder'а только собранный dist
COPY --from=builder /app/dist ./dist

# Порт, который слушает NestJS (у вас в main.ts app.listen(3000))
EXPOSE 3000

# Запускаем именно продакшен-код из dist, а не ts-node из src
CMD ["node", "dist/main.js"]