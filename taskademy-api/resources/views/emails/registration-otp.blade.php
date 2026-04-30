<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Taskademy verification code</title>
</head>
<body style="margin:0;padding:24px;background:#0f0f1a;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#1e1e2e;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:32px;">
        <p style="margin:0 0 12px;font-size:14px;color:#9ca3af;">Taskademy account verification</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#ffffff;">Your OTP code</h1>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#d1d5db;">
            Hi {{ $name }}, use the code below to finish creating your Taskademy account.
        </p>
        <div style="margin:0 0 24px;padding:20px;border-radius:16px;background:#111827;text-align:center;">
            <div style="font-size:36px;font-weight:700;letter-spacing:10px;color:#00ff88;">{{ $otp }}</div>
        </div>
        <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#d1d5db;">
            This code expires in {{ $expiresInMinutes }} minutes.
        </p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#9ca3af;">
            If you did not start this registration, you can safely ignore this email.
        </p>
    </div>
</body>
</html>
