# Film! — Backend

Бэкенд-часть учебного проекта «Film!» — онлайн-сервиса бронирования билетов в кинотеатр.
Реализован на **Nest.js** с хранением данных в **MongoDB** через **Mongoose**.

## Стек

- **Node.js** 20+
- **Nest.js** 10
- **MongoDB** 7+ (локально)
- **Mongoose** 8
- **TypeScript** 5
- **class-validator** / **class-transformer** — валидация DTO
- **Jest** — unit-тесты

## Требования

- Node.js 20 или новее
- npm 10+
- MongoDB, запущенная на `localhost:27017`

## Установка

```bash
cd backend
npm ci
```

## Настройка окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Содержимое `.env`:

```
DATABASE_DRIVER="mongodb"
DATABASE_URL="mongodb://localhost:27017/prac"
DEBUG=*
```

- `DATABASE_URL` — строка подключения к MongoDB. База `prac` создаётся автоматически при первой записи.

## Запуск MongoDB

Если MongoDB не запущена как сервис, запустите `mongod` вручную в отдельном терминале:

```bash
mongod --dbpath ~/mongodb-data
```

Проверить, что сервер поднялся, можно так:

```bash
mongosh --eval "db.runCommand({ping:1})"
# ожидаемый ответ: { ok: 1 }
```

## Загрузка начальных данных

В репозитории есть готовый набор фильмов: `test/mongodb_initial_stub.json` (6 фильмов с расписанием).

Загрузить их в MongoDB можно двумя способами.

### Вариант 1: Compass (GUI)

1. Откройте Compass и подключитесь к `mongodb://localhost:27017`.
2. Создайте базу `prac` и коллекцию `films`.
3. Внутри коллекции: **Add Data → Import JSON or CSV file**.
4. Выберите `backend/test/mongodb_initial_stub.json`.
5. В настройках импорта укажите:
   - **File type:** JSON
   - **JSON format:** Array
6. Импорт.

### Вариант 2: скрипт-сидер

```bash
npx ts-node test/seed.ts
```

Скрипт очистит коллекцию `films` и зальёт данные из JSON-файла.

## Запуск приложения

```bash
# Режим разработки (watch)
npm run start:dev

# С отладчиком
npm run start:debug

# Production-сборка
npm run build
npm run start:prod
```

По умолчанию сервер слушает `http://localhost:3000`.

## API

Все эндпоинты имеют префикс `/api/afisha`.

### `GET /api/afisha/films`

Список фильмов.

**Ответ:**
```json
{
  "total": 6,
  "items": [
    {
      "id": "0e33c7f6-27a7-4aa0-8e61-65d7e5effecf",
      "rating": 2.9,
      "director": "Итан Райт",
      "tags": ["Документальный"],
      "title": "Архитекторы общества",
      "about": "...",
      "description": "...",
      "image": "/bg1s.jpg",
      "cover": "/bg1c.jpg",
      "schedule": [ /* массив сеансов */ ]
    }
  ]
}
```

### `GET /api/afisha/films/:id/schedule`

Расписание конкретного фильма.

**Ответ:**
```json
{
  "total": 9,
  "items": [
    {
      "id": "f2e429b0-685d-41f8-a8cd-1d8cb63b99ce",
      "daytime": "2024-06-28T10:00:53+03:00",
      "hall": 0,
      "rows": 5,
      "seats": 10,
      "price": 350,
      "taken": ["1:2", "3:5"]
    }
  ]
}
```

- `taken` — массив занятых мест в формате `"${row}:${seat}"`.

**Ошибки:**
- `404` — фильм не найден.

### `POST /api/afisha/order`

Создание бронирования.

**Тело запроса:**
```json
{
  "email": "test@test.ru",
  "phone": "+7 (000) 000-00-00",
  "tickets": [
    {
      "film": "0e33c7f6-27a7-4aa0-8e61-65d7e5effecf",
      "session": "f2e429b0-685d-41f8-a8cd-1d8cb63b99ce",
      "daytime": "2024-06-28T10:00:53+03:00",
      "row": 2,
      "seat": 5,
      "price": 350
    }
  ]
}
```

**Ответ:**
```json
{
  "total": 1,
  "items": [
    {
      "film": "0e33c7f6-27a7-4aa0-8e61-65d7e5effecf",
      "session": "f2e429b0-685d-41f8-a8cd-1d8cb63b99ce",
      "daytime": "2024-06-28T10:00:53+03:00",
      "row": 2,
      "seat": 5,
      "price": 350,
      "id": "a3a0625b-eb7f-46e4-8975-db66355e1759"
    }
  ]
}
```

**Ошибки:**
- `400` — место занято, фильм не найден, сеанс не найден или в одном запросе указаны дубликаты мест.

### `GET /content/afisha/*`

Статика — постеры фильмов из папки `backend/public/`.

Например: `http://localhost:3000/content/afisha/bg1s.jpg`.

## Архитектура

Проект построен на паттерне **Repository**, что позволяет подменить хранилище без изменений в бизнес-логике.

```
src/
├── main.ts                       # bootstrap
├── app.module.ts                 # корневой модуль
├── app.config.provider.ts        # чтение .env в типизированный AppConfig
├── films/
│   ├── films.module.ts
│   ├── films.controller.ts       # GET /films, GET /films/:id/schedule
│   ├── films.service.ts
│   ├── entities/film.entity.ts   # Mongoose-схема Film + Schedule
│   └── dto/                      # FilmDto, ScheduleDto, ...
├── order/
│   ├── order.module.ts
│   ├── order.controller.ts       # POST /order
│   ├── order.service.ts          # бизнес-логика бронирования
│   ├── entities/order.entity.ts
│   └── dto/                      # CreateOrderDto, TicketDto, ...
└── repository/
    ├── repository.interface.ts   # абстрактный класс Repository<T> + токены
    ├── mongo-films.repository.ts # реализация для MongoDB
    └── orders.repository.ts      # in-memory хранилище заказов
```

- **`FilmsModule`** предоставляет `FILMS_REPOSITORY` → `MongoFilmsRepository`.
- **`OrderModule`** использует `FILMS_REPOSITORY` (для обновления `taken`) и `ORDERS_REPOSITORY` (in-memory).
- **`OrderService`** работает только с интерфейсом `Repository<T>` — ни один сервис не знает, что под ним Mongo или память.

## Логика бронирования

Алгоритм `OrderService.create`:

1. Для каждого тикета найти фильм (`film`) и сеанс (`session`).
2. Сформировать ключ места: `"${row}:${seat}"`.
3. Проверить, что места нет в `session.taken` **и** что оно не дублируется внутри самого запроса.
4. Если место занято — вернуть `400`, **не сохраняя** ни одного тикета (атомарность).
5. Если все места свободны — добавить их в `taken`, сохранить фильм через репозиторий.
6. Сохранить заказ в `ORDERS_REPOSITORY`, вернуть подтверждение с `id` каждого тикета.

## Тесты

```bash
# Unit-тесты
npm test

# Watch-режим
npm run test:watch

# Покрытие
npm run test:cov

# E2E
npm run test:e2e
```

Покрыт `OrderService` — сценарии: успешное бронирование, занятое место, дубликаты в одном запросе, несуществующий фильм, несуществующий сеанс, бронь нескольких мест.

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run build` | Собирает проект в `dist/` |
| `npm run start` | Запускает без watch |
| `npm run start:dev` | Запускает с watch |
| `npm run start:debug` | Запускает с отладчиком |
| `npm run start:prod` | Запускает из `dist/` |
| `npm run lint` | Запускает ESLint с автофиксом |
| `npm run format` | Prettier по `src/` и `test/` |
| `npm test` | Unit-тесты |
| `npm run test:e2e` | E2E-тесты |

## Лицензия

UNLICENSED. Учебный проект Yandex Practicum.