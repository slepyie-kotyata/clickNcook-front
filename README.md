# Click & Cook — Frontend

## Описание проекта

**Click & Cook** — браузерная idle / clicker-игра с кулинарной тематикой.  
Игрок начинает с простых действий и постепенно строит полноценную кулинарную империю: открывает локации, покупает улучшения, автоматизирует процессы и проходит обучение через интерактивный туториал.

Данный репозиторий содержит **фронтенд-часть** проекта, реализованную на **Angular (standalone-архитектура)** с использованием **Feature-Sliced Design (FSD)**.

---

## Технологический стек

### Основное
- **Angular** 18+ (standalone components, signals)
- **TypeScript**
- **Tailwind CSS**
- **RxJS**

### Архитектура и состояние
- Feature-Sliced Design (FSD)
- Game Store (signals / state management)
- Разделение на `entities / features / widgets / pages`

### Интеграции
- **REST API**
- **WebSocket** (реалтайм-обновления сессии)
- **PWA** (service worker, offline.html, manifest)
- **LocalStorage** (кэш и пользовательские настройки)

### Дополнительно
- Tutorial system (overlay + anchors)
- Sound system (SFX, музыка)
- Guards (auth)
- API interceptor
- Update / PWA services

---

## Основной функционал

### Игровые механики
- Клики и действия для получения ресурсов
- Улучшения (оборудование, автоматизация, бонусы)
- Локации и прогресс по зонам
- Престиж-система с пересчётом прогресса
- Формулы роста (деньги, опыт, уровни)

### Пользовательская часть
- Авторизация / регистрация
- Профиль игрока
- Визуальный прогресс уровня
- Адаптивный интерфейс (desktop / mobile)

### Туториал
- Пошаговый интерактивный туториал
- Якоря (`tutorial-anchor`)
- Overlay-подсказки
- Централизованная конфигурация шагов

### Звук
- Клики
- Покупка / продажа
- Повышение уровня
- Престиж

---

## Структура проекта

Проект организован по **Feature-Sliced Design**.

```plaintext
public/
 ├── backgrounds/        # Фоны экранов
 ├── icons/              # SVG-иконки (auth, game, menu, upgrades)
 ├── locations/          # Графика локаций
 ├── sounds/             # Звуковые эффекты
 ├── manifest.webmanifest
 ├── service-worker.js
 └── offline.html

src/
 ├── app/
 │   ├── app.component.*
 │   ├── app.routes.ts
 │   ├── app.config.ts
 │
 │   ├── entities/       # Бизнес-сущности
 │   │   ├── game.ts
 │   │   ├── api.ts
 │   │   ├── types.ts
 │   │   └── tutorial.types.ts
 │
 │   ├── pages/          # Страницы
 │   │   ├── auth/
 │   │   ├── reg/
 │   │   └── game/
 │
 │   ├── widgets/        # Крупные UI-блоки
 │   │   ├── game-header/
 │   │   ├── game-buttons/
 │   │   ├── upgrade-window/
 │   │   ├── prestige-window/
 │   │   ├── tutorial-overlay/
 │   │   └── profile/
 │
 │   ├── features/       # Локальная логика фич
 │   │   └── menu/
 │
 │   └── shared/
 │       ├── ui/         # Переиспользуемые UI-компоненты
 │       │   ├── auth-input/
 │       │   ├── menu-button/
 │       │   ├── upgrade-button/
 │       │   ├── modal/
 │       │   └── loading/
 │       │
 │       └── lib/        # Общая логика
 │           ├── services/
 │           │   ├── game/
 │           │   ├── api.service.ts
 │           │   ├── auth.service.ts
 │           │   ├── web-socket.service.ts
 │           │   ├── tutorial.service.ts
 │           │   ├── sound.service.ts
 │           │   ├── pwa.service.ts
 │           │   └── update.service.ts
 │           │
 │           ├── stores/
 │           │   └── gameStore.ts
 │           │
 │           ├── guards/
 │           │   └── auth.guard.ts
 │           │
 │           ├── directives/
 │           │   └── tutorial-anchor.directive.ts
 │           │
 │           ├── tutorial.config.ts
 │           ├── formatNumber.ts
 │           ├── formValidators.ts
 │           └── api.interceptor.ts
```

---

## Запуск проекта
### Установка зависимостей
```bash
npm install 
```

### Запуск в режиме разработки
```bash 
npm run start 
```

### Production-сборка
```bash
npm run build 
```

---

## Архитектурные принципы

- Standalone-компоненты (без NgModules)
- Разделение ответственности (UI / logic / state)
- Минимальная связанность между слоями
- Вся игровая логика вынесена в сервисы и store

---

## Статус проекта

Проект находится в активной разработке.
Архитектура и структура стабилизированы, ведётся итеративное развитие механик и UI.

---

## Лицензия

Проект является учебно-пет-проектом.
Коммерческое использование возможно только с разрешения автора.
