import { Suspense, useEffect } from 'react';
import { useRoutes, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './components/home';
import AdminDashboard from './components/admin/AdminDashboard';
import MemberDashboard from './components/dashboard/MemberDashboard';
import routes from './tempo-routes';

function App() {
  useEffect(() => {}, []);
  return (
    <HelmetProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
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

export default App;
