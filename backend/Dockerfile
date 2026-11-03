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
# Этап 2: production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Копируем собранный код
COPY --from=builder /app/dist ./dist

COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "dist/main.js"]