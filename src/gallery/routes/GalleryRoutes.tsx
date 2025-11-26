import { Navigate, Route, Routes } from 'react-router-dom';
import { GalleryPage } from '../pages';
import Riesgo from '../pages/Riesgo';

export const GalleryRoutes = () => {
  return (
    <Routes>
      {/* TEMP: muestra Riesgo por defecto para verificar render */}
      <Route index element={<Riesgo />} />        {/* URL: / */}
      <Route path="home" element={<GalleryPage />} />
      <Route path="riesgos" element={<Riesgo />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};
