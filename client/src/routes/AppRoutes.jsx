import { Routes, Route } from 'react-router'
import { LoginPage, RegisterPage } from '../features/auth'
import { OnboardingPage } from '../features/onboarding'

const AppRoutes = () => {
    return (
        <Routes>
            <Route index element={<OnboardingPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
        </Routes>
    )
}

export default AppRoutes