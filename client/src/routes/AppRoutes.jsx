import { Routes, Route } from 'react-router';
import { LoginPage, RegisterPage } from '@/features/auth';
import { OnboardingPage } from '@/features/onboarding';
import PreAuthLayout from '@/shared/layouts/PreAuthLayout';

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
