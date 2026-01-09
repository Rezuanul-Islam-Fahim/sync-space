import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-discord-main-bg flex flex-col justify-center items-center text-white p-6">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
