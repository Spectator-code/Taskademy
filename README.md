# Taskademy

Taskademy is a student task marketplace with a React frontend and a Laravel API. The repository contains the web client, the backend service, and the supporting configuration needed for local development.

## Project Structure

- `src/`: React application built with Vite and TypeScript
- `taskademy-api/`: Laravel API for authentication, tasks, messaging, profiles, and admin features
- `public/`: static frontend assets

## Frontend Setup

1. Install dependencies with `npm install`
2. Create a root `.env` file:
   - `VITE_API_URL=http://localhost:8000/api`
3. Start the frontend with `npm run dev`

## Backend Setup

1. Go to `taskademy-api/`
2. Install PHP dependencies with Composer
3. Copy `.env.example` to `.env`
4. Configure the database and app settings
5. Run `php artisan migrate --seed`
6. Start the API with `php artisan serve`

## Scripts

- Root: `npm run dev`, `npm run build`
- API: `php artisan serve`, `php artisan test`

## Deployment

Deployment notes are in [DEPLOYMENT.md](DEPLOYMENT.md).
