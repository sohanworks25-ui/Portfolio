
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Zap, 
  MessageSquare, 
  Settings, 
  LogOut,
  Star,
  Layers,
  GraduationCap,
  History,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, data } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleViewSite = () => {
    navigate('/');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Profile', icon: User, path: '/admin/profile' },
    { name: 'Skills', icon: Zap, path: '/admin/skills' },
    { name: 'Experience', icon: History, path: '/admin/experience' },
    { name: 'Education', icon: GraduationCap, path: '/admin/education' },
    { name: 'Services', icon: Layers, path: '/admin/services' },
    { name: 'Projects', icon: Briefcase, path: '/admin/projects' },
    { name: 'Testimonials', icon: Star, path: '/admin/testimonials' },
    { name: 'Messages', icon: MessageSquare, path: '/admin/messages', count: data.messages.filter(m => !m.read).length },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-500 z-[70] ${
      isOpen ? 'w-64 translate-x-0' : 'w-20 lg:translate-x-0 -translate-x-full'
    } lg:translate-x-0`}>
      <div className="h-16 sm:h-20 flex items-center px-6 border-b border-gray-50 dark:border-gray-800">
        <Link to="/admin" className="flex items-center gap-3 outline-none">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Settings size={20} />
          </div>
          <span className={`font-black text-gray-900 dark:text-white text-lg tracking-tighter transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible lg:hidden'}`}>
            CMS Panel
          </span>
        </Link>
      </div>

      <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-14rem)] custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group outline-none
              ${isActive 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-blue-600'}
            `}
          >
            <item.icon size={22} className="shrink-0" />
            <span className={`font-bold text-sm tracking-tight transition-all duration-300 whitespace-nowrap ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible lg:hidden'}`}>
              {item.name}
            </span>
            {item.count ? (
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center border-2 border-white dark:border-gray-800 ${!isOpen && 'top-2 right-2'}`}>
                {item.count}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-6 left-0 w-full px-4 space-y-3">
        <button 
          onClick={handleViewSite}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all font-black text-sm outline-none"
        >
          <ExternalLink size={22} className="shrink-0" />
          <span className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 invisible lg:hidden'}`}>
            View Site
          </span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-black text-sm outline-none border-t border-gray-50 dark:border-gray-800 pt-5 mt-2"
        >
          <LogOut size={22} className="shrink-0" />
          <span className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 invisible lg:hidden'}`}>
            Exit Console
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
