// src/router/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom'; // 👈 DOM

import { useCheckAuth } from '../hooks';
import { CheckingAuth } from '../ui';
import { AuthRoutes } from '../auth';
import { GalleryRoutes } from '../gallery';

export const AppRouter = () => {
  const status = useCheckAuth();

  if (status === 'checking') return <CheckingAuth />;

  return (
    <Routes>
      {status === 'authenticated' ? (
        // Monta la app en la raíz
        <Route path="/*" element={<GalleryRoutes />} />
      ) : (
        <Route path="/auth/*" element={<AuthRoutes />} />
      )}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};
