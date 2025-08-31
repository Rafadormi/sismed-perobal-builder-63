
import { NavLink } from 'react-router-dom';
import { Home, Users, Pill, FileText, FileCheck, ClipboardCheck, Settings } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/pacientes', label: 'Pacientes', icon: Users },
  { to: '/medicamentos', label: 'Medicamentos', icon: Pill },
  { to: '/receitas', label: 'Receitas', icon: FileText },
  { to: '/atestados', label: 'Atestados', icon: FileCheck },
  { to: '/comparecimentos', label: 'Comparecimentos', icon: ClipboardCheck },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

export function ModernSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-dark to-[#1e293b] text-white p-6 shadow-[8px_0_30px_rgba(0,0,0,0.2)] rounded-tr-[35px] rounded-br-[35px]">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-white">SISMED Perobal</h1>
        <p className="text-sm text-gray-300 mt-1">Sistema de Saúde Municipal</p>
      </div>
      <nav className="flex flex-col space-y-2">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 rounded-xl p-3 text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white ${
                isActive ? 'bg-gradient-to-r from-primary to-secondary font-semibold text-white shadow-lg' : ''
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
