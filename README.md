## About this Project

This web application was developed as part of a bachelor thesis at the SAE Institute Munich. It is a planning tool for shift scheduling in companies with 24/7 rotating shift systems.

This Project is open source and can be used freely non-commericalized.

## Requirements

- PHP 8 (install via Homebrew)
- Composer
- mySQL
- nodeJS

## Install

- Config database settings in .env
- `npm install`
- (optional) `php artisan migrate:fresh --seed`: Generates basic database data
- `php artisan serve`: Starts the PHP Server
- `npm run mix`: Starts Laravel Mix
