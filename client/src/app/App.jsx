import { Suspense } from 'react';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'react-hot-toast';
import AppRoutes from '@/routes/AppRoutes';
import SuspenseFallback from '@/shared/components/SuspenseFallback';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Suspense fallback={<SuspenseFallback />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
