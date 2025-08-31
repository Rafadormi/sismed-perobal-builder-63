
import { useEffect } from 'react';
import AppRoutes from './AppRoutes';

function App() {
  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 500);
    }
  }, []);

  return <AppRoutes />;
}

export default App;
