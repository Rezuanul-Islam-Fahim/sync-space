import { Outlet } from 'react-router';

const PreAuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center items-center py-12">
      <Outlet />
    </div>
  );
};

export default PreAuthLayout;
