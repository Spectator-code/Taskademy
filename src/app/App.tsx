import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';

import { AppProvider } from './contexts/AppContext';

import { useState, useCallback } from 'react';
import LoadingSplash from './components/ui/LoadingSplash';
import ScrollToTopButton from './components/ui/ScrollToTopButton';

export default function App() {
  const [loading, setLoading] = useState(true);
  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <AuthProvider>
      <AppProvider>
        {loading && <LoadingSplash onComplete={handleLoadingComplete} />}
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
