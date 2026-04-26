import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';

import { AppProvider } from './contexts/AppContext';

import { useState } from 'react';
import LoadingSplash from './components/ui/LoadingSplash';
import ScrollToTopButton from './components/ui/ScrollToTopButton';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AuthProvider>
      <AppProvider>
        {loading && <LoadingSplash onComplete={() => setLoading(false)} />}
        {!loading && (
          <>
            <RouterProvider router={router} />
            <ScrollToTopButton />
          </>
        )}
        <Toaster />
      </AppProvider>
    </AuthProvider>
  );
}
