import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-main-bg flex flex-col justify-center items-center text-text p-6">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
