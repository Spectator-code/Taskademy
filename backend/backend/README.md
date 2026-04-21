# Taskademy Laravel Backend

## Setup

1. `cd backend`
2. `composer install`
3. `cp .env.example .env`
4. `php artisan key:generate`
5. Edit `.env` (DB, `FRONTEND_URL=http://localhost:5173`)
6. `php artisan migrate`
7. `php artisan serve` (http://localhost:8000)

## Test

Register/login via frontend. All endpoints match React services.

## Full API Docs in main README.md
