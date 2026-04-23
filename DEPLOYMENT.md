# Deployment Notes

## Frontend

- Build command: `npm run build`
- Environment file: `.env`
- Required variable:
  - `VITE_API_URL=https://your-api-domain/api`
  - `VITE_BROADCAST_AUTH_URL=https://your-api-domain/broadcasting/auth`
  - `VITE_REVERB_APP_KEY=your-reverb-app-key`
  - `VITE_REVERB_HOST=your-reverb-domain`
  - `VITE_REVERB_PORT=443`
  - `VITE_REVERB_SCHEME=https`

## Backend

- App directory: `taskademy-api`
- Required environment values:
  - `APP_ENV=production`
  - `APP_DEBUG=false`
  - `APP_URL=https://your-api-domain`
  - `FRONTEND_URL=https://your-frontend-domain`
  - `SANCTUM_STATEFUL_DOMAINS=your-frontend-domain`
  - `BROADCAST_CONNECTION=reverb`
  - `REVERB_APP_ID=your-reverb-app-id`
  - `REVERB_APP_KEY=your-reverb-app-key`
  - `REVERB_APP_SECRET=your-reverb-app-secret`
  - `REVERB_HOST=your-reverb-domain`
  - `REVERB_PORT=443`
  - `REVERB_SCHEME=https`
  - `REVERB_SERVER_HOST=0.0.0.0`
  - `REVERB_SERVER_PORT=8080`
  - `REVERB_ALLOWED_ORIGINS=https://your-frontend-domain`
  - `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`

## Backend deploy steps

1. `composer install --no-dev --optimize-autoloader`
2. Copy `.env.example` to `.env` and fill production values.
3. `php artisan key:generate`
4. `php artisan migrate --force`
5. `php artisan storage:link`
6. `php artisan config:cache`
7. `php artisan route:cache`

## Reverb runtime

- Run the WebSocket server as a supervised process: `php artisan reverb:start --host=0.0.0.0 --port=8080`
- Keep the Laravel app process and Reverb process on the same Reverb app ID/key/secret values.
- Put a reverse proxy in front of Reverb for production TLS and WebSocket upgrades, then point `REVERB_HOST` and `VITE_REVERB_HOST` at that public host.
- Keep `QUEUE_CONNECTION` configured for the rest of the app. Message broadcasting uses `ShouldBroadcastNow`, so chat delivery does not wait for a queue worker.

## Verification

- Frontend production build completes successfully.
- Backend test command runs, but database-backed feature tests are skipped in environments without `pdo_sqlite`.
- `php artisan route:list --path=broadcasting -v` shows `/broadcasting/auth` behind `api` and `auth:sanctum` middleware.
- Task browsing, task details, task posting, and admin overview now use live API data instead of local mock state.
