import { Routes, Route } from 'react-router'
import { LoginPage, RegisterPage } from '../features/auth'

const AppRoutes = () => {
    return (
        <Routes>
            <Route index element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
        </Routes>
    )
}

export default AppRoutes