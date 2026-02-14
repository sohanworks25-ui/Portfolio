
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data, darkMode, toggleDarkMode } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Projects', id: 'projects' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className={`fixed w-full z-[60] transition-all duration-500 ${
      scrolled 
        ? 'py-3 sm:py-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-xl border-b border-gray-100 dark:border-gray-900' 
        : 'py-6 sm:py-8 bg-transparent'
    }`}>
      <div className="container mx-auto px-6 sm:px-10 flex justify-between items-center">
        <button 
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsOpen(false);
          }} 
          className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent outline-none tracking-tight"
        >
          {data.logo}
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.id)}
              className="text-[13px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors outline-none"
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={toggleDarkMode}
            className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Nav Button */}
        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={toggleDarkMode} 
            className="p-3 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 active:scale-90 transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`p-3 rounded-xl transition-all active:scale-90 ${isOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 z-[-1] bg-white dark:bg-gray-950 transition-all duration-500 ease-in-out ${
        isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-full invisible'
      }`}>
        <div className="flex flex-col h-full justify-center px-10 gap-10">
          {navLinks.map((link, i) => (
            <button 
              key={link.name} 
              onClick={() => handleNavClick(link.id)}
              style={{ transitionDelay: `${i * 50}ms` }}
              className={`text-left text-4xl font-black text-gray-900 dark:text-white hover:text-blue-600 transition-all ${
                isOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
            >
              {link.name}
            </button>
          ))}
          <div className={`pt-10 border-t border-gray-100 dark:border-gray-800 transition-all delay-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Social Presence</p>
            <div className="flex gap-6">
               {data.profile.socials.slice(0, 3).map((s, idx) => (
                 <a key={idx} href={s.url} target="_blank" className="text-gray-600 dark:text-gray-400 text-sm font-bold">{s.platform}</a>
               ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
