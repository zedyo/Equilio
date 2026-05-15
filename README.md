## About this Project

This web application was developed as part of a bachelor thesis at the SAE Institute Munich. It is a planning tool for shift scheduling in companies with 24/7 rotating shift systems.

This Project is open source and can be used freely non-commercialized.

## Tech Stack

- **Backend:** PHP 8.2+ / Laravel 12 (REST API)
- **Frontend:** React 19 + Redux Toolkit 2 + React-Bootstrap, built with Vite
- **Database:** MySQL (or SQLite for local development)

## Requirements

- PHP >= 8.2
- Composer
- Node.js (>= 20)
- MySQL (optional — SQLite works out of the box)

## Backend setup

```bash
composer install
cp .env.example .env
php artisan key:generate
# SQLite (simplest): set DB_CONNECTION=sqlite in .env and:
touch database/database.sqlite
php artisan migrate --seed     # generates basic demo data
php artisan serve              # API at http://localhost:8000/api
```

## Frontend setup

```bash
npm install
npm run dev       # Vite dev server (HMR)
npm run build     # production build -> dist/
npm run preview   # serve the built dist/ locally
```

## Online demo

A backend-free demo (in-browser mock) is deployed via GitHub Pages:
**https://zedyo.github.io/yourPlan/** — see `CLAUDE.md` for details.
