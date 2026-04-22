# Deployment Notes

## Frontend

- Build command: `npm run build`
- Environment file: `.env`
- Required variable:
  - `VITE_API_URL=https://your-api-domain/api`

## Backend

- App directory: `taskademy-api`
- Required environment values:
  - `APP_ENV=production`
  - `APP_DEBUG=false`
  - `APP_URL=https://your-api-domain`
  - `FRONTEND_URL=https://your-frontend-domain`
  - `SANCTUM_STATEFUL_DOMAINS=your-frontend-domain`
  - `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`

## Backend deploy steps

1. `composer install --no-dev --optimize-autoloader`
2. Copy `.env.example` to `.env` and fill production values.
3. `php artisan key:generate`
4. `php artisan migrate --force`
5. `php artisan storage:link`
6. `php artisan config:cache`
7. `php artisan route:cache`

## Verification

- Frontend production build completes successfully.
- Backend test command runs, but database-backed feature tests are skipped in environments without `pdo_sqlite`.
- Task browsing, task details, task posting, and admin overview now use live API data instead of local mock state.
