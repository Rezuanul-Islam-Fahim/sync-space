import { lazy } from 'react';
import { Routes, Route } from 'react-router';
import PreAuthLayout from '@/shared/layouts/PreAuthLayout';

const OnboardingPage = lazy(() => import('@/features/onboarding'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PreAuthLayout />}>
        <Route index element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
