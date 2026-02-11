# ИИ-перезагрузка — Лендинг марафона «Бизнес с ИИ»

Лендинг для продажи 7-дневного марафона по внедрению ИИ в бизнес.  
React + TypeScript + Vite + Tailwind CSS v4.

## Быстрый старт

```bash
npm install
npm run dev       # Локальная разработка → http://localhost:5173
npm run build     # Продакшн-сборка
npm run preview   # Предпросмотр сборки
```

## Структура проекта

```
src/
├── components/
│   ├── admin/              # Админ-панель
│   │   ├── AdminLayout.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminFormElements.tsx
│   │   └── editors/        # Редакторы каждого блока
│   │       ├── HeroEditor.tsx
│   │       ├── ProblemsEditor.tsx
│   │       ├── AudienceEditor.tsx
│   │       ├── FormatEditor.tsx
│   │       ├── ProgramEditor.tsx
│   │       ├── BenefitsEditor.tsx
│   │       ├── SpeakerEditor.tsx
│   │       ├── TestimonialsEditor.tsx
│   │       ├── PricingEditor.tsx
│   │       ├── FAQEditor.tsx
│   │       ├── UpsellEditor.tsx
│   │       └── FooterEditor.tsx
│   ├── landing/            # Блоки лендинга (12 секций по ТЗ)
│   │   ├── Hero.tsx
│   │   ├── Problems.tsx
│   │   ├── Audience.tsx
│   │   ├── Format.tsx
│   │   ├── Program.tsx
│   │   ├── Benefits.tsx
│   │   ├── Speaker.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Pricing.tsx
│   │   ├── FAQ.tsx
│   │   ├── Upsell.tsx
│   │   └── Footer.tsx
│   └── shared/             # Переиспользуемые компоненты
│       ├── Button.tsx
│       ├── CountdownTimer.tsx
│       ├── FloatingCTA.tsx
│       ├── LeadForm.tsx
│       ├── Modal.tsx
│       ├── Navbar.tsx
│       ├── ScrollProgress.tsx
│       └── SectionWrapper.tsx
├── context/
│   └── ContentContext.tsx   # Контекст управления контентом
├── data/
│   └── defaultContent.ts   # Дефолтный контент всех блоков
├── pages/
│   ├── LandingPage.tsx
│   └── AdminPage.tsx
├── types/
│   └── content.ts          # TypeScript-типы для всего контента
├── App.tsx                  # Роутинг
├── main.tsx
└── index.css               # Tailwind + кастомные стили
```

## Маршруты

| URL | Описание |
|---|---|
| `/` | Основной лендинг |
| `/admin` | Админ-панель (дашборд) |
| `/admin/:section` | Редактирование конкретной секции |

## Админ-панель

Доступна по адресу `/admin`. Позволяет редактировать весь контент лендинга:
- Все 12 блоков лендинга (тексты, списки, карточки)
- Данные сохраняются в `localStorage`
- Изменения применяются мгновенно
- Есть кнопка сброса к значениям по умолчанию

## Технологии

- **React 19** + **TypeScript** (strict)
- **Vite** — сборка
- **Tailwind CSS v4** — стилизация
- **React Router v7** — маршрутизация
- **React Hook Form** — формы и валидация
- **Framer Motion** — анимации
- **Lucide React** — иконки

## Переменные окружения

Скопируйте `.env.example` в `.env` и заполните нужные ключи:

```bash
cp .env.example .env
```

## Подготовка к платёжной системе

В компоненте `LeadForm.tsx` есть TODO-заглушка для интеграции с платёжной системой (ЮKassa/CloudPayments). Модалка оплаты уже работает, нужно заменить имитацию на реальный API-вызов.

## Деплой

```bash
npm run build
# Папка dist/ готова для Vercel, Netlify, Timeweb, S3 и т.п.
```
