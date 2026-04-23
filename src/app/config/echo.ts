import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;
const reverbHost = import.meta.env.VITE_REVERB_HOST || window.location.hostname;
const reverbPort = Number(import.meta.env.VITE_REVERB_PORT || 8080);
const reverbScheme = import.meta.env.VITE_REVERB_SCHEME || 'http';
const broadcastAuthUrl =
  import.meta.env.VITE_BROADCAST_AUTH_URL || 'http://localhost:8000/broadcasting/auth';

let echo: Echo<'reverb'> | null = null;

export function getEcho(): Echo<'reverb'> | null {
  if (!reverbKey) {
    return null;
  }

  if (echo) {
    return echo;
  }

  (window as unknown as { Pusher: typeof Pusher }).Pusher = Pusher;

  echo = new Echo({
    broadcaster: 'reverb',
    key: reverbKey,
    wsHost: reverbHost,
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS: reverbScheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authorizer: (channel: { name: string }) => ({
      authorize: async (
        socketId: string,
        callback: (error: boolean, data: unknown) => void,
      ) => {
        const token = localStorage.getItem('auth_token');

        try {
          const response = await fetch(broadcastAuthUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          });

          if (!response.ok) {
            callback(true, null);
            return;
          }

          callback(false, await response.json());
        } catch {
          callback(true, null);
        }
      },
    }),
  } as any);

  return echo;
}

export function disconnectEcho(): void {
  echo?.disconnect();
  echo = null;
}
