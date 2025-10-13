import { Suspense, useEffect } from 'react';
import { useRoutes, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './components/home';
import AdminDashboard from './components/admin/AdminDashboard';
import MemberDashboard from './components/dashboard/MemberDashboard';
import routes from './tempo-routes';
import { Loader2 } from 'lucide-react';
import NotFound from './components/layout/NotFound';

function App() {
  useEffect(() => {}, []);
  return (
    <HelmetProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<MemberDashboard />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === 'true' && useRoutes(routes)}
        </>
      </Suspense>
    </HelmetProvider>
  );
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center w-[100svw] h-[100svh]">
    <div className="spinner">
      <Loader2 className="text-gray-600 animate-spin ease-in-out" />
    </div>
  </div>
);
export default App;
