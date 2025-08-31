
import React from 'react';
import { ModernSidebar } from './ModernSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light to-blue-50">
      <ModernSidebar />
      <main className="ml-72 p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
