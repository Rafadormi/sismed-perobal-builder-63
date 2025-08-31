
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Index from '@/pages/Index';
import Identificacao from '@/pages/Identificacao';
import Pacientes from '@/pages/Pacientes';
import Medicamentos from '@/pages/Medicamentos';
import Receitas from '@/pages/Receitas';
import ConfiguracoesDesktop from '@/pages/ConfiguracoesDesktop';
import NotFound from '@/pages/NotFound';
import { Toaster } from 'sonner';
import Atestados from '@/pages/Atestados';
import Comparecimentos from '@/pages/Comparecimentos';

const AppRoutes = () => {
  const [isLoading, setIsLoading] = useState(false); // Removido loading
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('sismed-current-professional');

    if (!loggedIn && location.pathname !== '/identificacao') {
      navigate('/identificacao');
    } else if (loggedIn && location.pathname === '/identificacao') {
      navigate('/');
    }

    setIsLoading(false);
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/identificacao" element={<Identificacao />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/medicamentos" element={<Medicamentos />} />
        <Route path="/receitas" element={<Receitas />} />
        <Route path="/atestados" element={<Atestados />} />
        <Route path="/comparecimentos" element={<Comparecimentos />} />
        <Route path="/configuracoes" element={<ConfiguracoesDesktop />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

export default AppRoutes;
