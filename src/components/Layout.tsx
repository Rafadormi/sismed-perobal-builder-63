
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Pill, FileText, Settings, FileCheck, ClipboardCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [professional, setProfessional] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const professionalData = sessionStorage.getItem('sismed-current-professional');
    if (professionalData) {
      setProfessional(JSON.parse(professionalData));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('sismed-current-professional');
    navigate('/identificacao');
  };

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/', 
      color: 'text-blue-600'
    },
    { 
      icon: Users, 
      label: 'Pacientes', 
      path: '/pacientes', 
      color: 'text-green-600'
    },
    { 
      icon: Pill, 
      label: 'Medicamentos', 
      path: '/medicamentos', 
      color: 'text-purple-600'
    },
    { 
      icon: FileText, 
      label: 'Receituários', 
      path: '/receitas', 
      color: 'text-orange-600'
    },
    { 
      icon: FileCheck, 
      label: 'Atestados', 
      path: '/atestados', 
      color: 'text-red-600'
    },
    { 
      icon: ClipboardCheck, 
      label: 'Comparecimentos', 
      path: '/comparecimentos', 
      color: 'text-cyan-600'
    },
    { 
      icon: Settings, 
      label: 'Configurações', 
      path: '/configuracoes', 
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Simplified */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-600 text-white font-semibold">
                {professional?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">
                {professional?.name || 'Usuário'}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {professional?.registry || 'CRM/CRF'}
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-blue-600">SISMED</div>
            <div className="text-xs text-gray-500">Sistema Médico v4.0</div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className={`flex items-center space-x-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
              }`}
            >
              <item.icon className={`h-5 w-5 ${location.pathname === item.path ? 'text-blue-600' : item.color}`} />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full text-left flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-100">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Sessão</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Sair do Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema Médico Perobal
              </h1>
              <p className="text-sm text-gray-500">
                Bem-vindo, {professional?.name || 'Usuário'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-xs text-gray-500">
                {new Date().toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
