## Equilio

**Equilio** is a planning tool for shift scheduling in companies with 24/7 rotating shift systems, originally developed as part of a bachelor thesis at the SAE Institute Munich (working titles: *Yeti* / *yourPlan*).

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

## Test dataset: real-world roster seeder

`RealRosterSeeder` contains an **anonymized** dataset derived from a real
care-facility duty roster (50 residents, 4 wards A–D, 5 source months):
36 staff with realistic qualifications, contracted hours and ~2,779 duty
entries. The duties are mapped onto a **rolling 5-month window that ends
in the current month**, so the plan is visible immediately when the app
starts (no need to navigate back in time). It is intentionally **not**
registered in `DatabaseSeeder`, so the default demo data and the existing
test suite stay untouched. The same anonymized data also powers the
in-browser demo (`resources/js/mock/realRosterData.js`). Background
notes: `.claude/memory/real-roster-insights.md`.

Run it **in addition** to the default data (own ID ranges, no conflict):

```bash
php artisan db:seed --class=RealRosterSeeder
```

Use it **instead** of the default demo data (fresh DB, only this set):

```bash
php artisan migrate:fresh
php artisan db:seed --class=RealRosterSeeder
```

Make it the default for local testing (override): add it to
`database/seeders/DatabaseSeeder.php` inside `run()`:

```php
$this->call(RealRosterSeeder::class);
```

then `php artisan migrate:fresh --seed`. The accompanying test
(`tests/Feature/RealRosterSeederTest.php`) verifies dataset integrity
and that the generator produces a rule-compliant plan on this data.

## Frontend setup

```bash
npm install
npm run dev       # Vite dev server (HMR)
npm run build     # production build -> dist/
npm run preview   # serve the built dist/ locally
```

## Online demo

A backend-free demo (in-browser mock) is deployed via GitHub Pages:
**https://zedyo.github.io/Equilio/** — see `CLAUDE.md` for details.
