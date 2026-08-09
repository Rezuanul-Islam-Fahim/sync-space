import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router';

import AppRoutes from '@/routes/AppRoutes';
import { SuspenseFallback } from '@/shared/components';

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
