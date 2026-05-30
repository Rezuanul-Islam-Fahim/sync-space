import { BrowserRouter } from 'react-router';
import { Toaster } from 'react-hot-toast';
import AppRoutes from '@/routes/AppRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
