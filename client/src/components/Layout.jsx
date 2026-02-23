import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const location = useLocation();
  const isCalendar = location.pathname === '/calendar';
  const isSettings = location.pathname === '/settings';

  return (
    <div className={`flex bg-gray-50 font-sans ${isCalendar ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      {!isSettings && <Sidebar collapsed={isCalendar} />}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCalendar ? 'ml-16' : isSettings ? 'ml-0' : 'ml-64'}`}>
        {!isCalendar && <Navbar />}
        <main className={`flex-1 ${isCalendar ? 'overflow-hidden flex flex-col' : 'p-8 overflow-y-auto'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
