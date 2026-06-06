import { lazy } from 'react';
import { Routes, Route } from 'react-router';
import { PreAuthLayout } from '@/shared/layouts';
import { APP_ROUTES } from '@/shared/config';

const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PreAuthLayout />}>
        <Route path={APP_ROUTES.HOME} element={<HomePage />} />
        <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
