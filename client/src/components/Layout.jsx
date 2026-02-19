import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const location = useLocation();
  const isCollapsed = location.pathname === '/calendar';

  return (
    <div className={`flex bg-gray-50 font-sans ${isCollapsed ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Sidebar collapsed={isCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {!isCollapsed && <Navbar />}
        <main className={`flex-1 ${isCollapsed ? 'overflow-hidden flex flex-col' : 'p-8 overflow-y-auto'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
