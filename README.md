# Taskademy

Taskademy is a student-focused task marketplace built with React, Vite, TypeScript, and a Laravel API. The frontend in this repository includes authentication flows, live task browsing, task detail pages, profile/settings pages, and an admin overview.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Laravel API integration

## Run The Frontend

1. Install dependencies with `npm install`
2. Create a root `.env` file with:
   - `VITE_API_URL=http://localhost:8000/api`
3. Start the app with `npm run dev`

## Deployment Notes

Deployment instructions are in [DEPLOYMENT.md](DEPLOYMENT.md).

## What Is Still Lacking

- The backend API lives in a separate local Laravel workspace and is not yet integrated into this root Git repository.
- The `Messages` page is still using mock conversation data.
- Parts of `Profile` and resume handling are still UI-only and are not backed by persistent API endpoints.
- Production infrastructure is still needed: hosting, database provisioning, Laravel process setup, storage wiring, and final domain/env configuration.
- Full backend feature tests require `pdo_sqlite` or another configured CI test database to run everywhere.

## Team
- Taskademy Development Team

