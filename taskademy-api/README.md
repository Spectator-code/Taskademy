# Taskademy API

Laravel backend for the Taskademy platform.

## Responsibilities

- user registration and authentication
- task creation, moderation, and lifecycle management
- conversations and messaging
- profile management
- admin reporting and user controls

## Local Setup

1. Install dependencies with Composer
2. Copy `.env.example` to `.env`
3. Configure database, mail, broadcast, and frontend URL settings
4. Run `php artisan migrate --seed`
5. Start the server with `php artisan serve`

## Common Commands

- `php artisan serve`
- `php artisan migrate`
- `php artisan db:seed`
- `php artisan test`
