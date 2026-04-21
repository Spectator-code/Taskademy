<!DOCTYPE html>
<html>
<head>
    <title>Taskademy API</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #333; }
        .api-docs { max-width: 600px; margin: 0 auto; text-align: left; }
    </style>
</head>
<body>
    <h1>Taskademy Laravel API Backend</h1>
    <p>API server running successfully! Frontend at <a href="http://localhost:3000">localhost:3000</a></p>
    
    <div class="api-docs">
        <h2>API Endpoints (localhost:8000/api)</h2>
        <ul>
            <li>POST /register - Create account</li>
            <li>POST /login - Authenticate</li>
            <li>GET /user - Current user</li>
            <li>POST /logout - Logout</li>
            <li>GET /tasks - List tasks</li>
            <li>Auth required for most routes</li>
        </ul>
        <h3>Test Credentials (after php artisan migrate --seed):</h3>
        <ul>
            <li>Admin: admin@taskademy.com / password123</li>
            <li>Student: student@taskademy.com / password123</li>
            <li>Client: client@taskademy.com / password123</li>
        </ul>
    </div>
</body>
</html>
<?php /**PATH C:\Users\Astral.FX\Desktop\task\backend\resources\views/welcome.blade.php ENDPATH**/ ?>