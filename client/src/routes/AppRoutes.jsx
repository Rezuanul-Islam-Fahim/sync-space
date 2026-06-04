import { Routes, Route } from 'react-router';
import { LoginPage, RegisterPage } from '@/features/auth';
import { OnboardingPage } from '@/features/onboarding';
import AuthLayout from '@/shared/layouts/AuthLayout';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route index element={<OnboardingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
