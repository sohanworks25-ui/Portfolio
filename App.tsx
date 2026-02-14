
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Services from './sections/Services';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import AdminDashboard from './admin/Dashboard';
import AdminLogin from './admin/Login';
import AdminProfile from './admin/Profile';
import AdminProjects from './admin/Projects';
import AdminSkills from './admin/Skills';
import AdminMessages from './admin/Messages';
import AdminSettings from './admin/Settings';
import AdminServices from './admin/Services';
import AdminTestimonials from './admin/Testimonials';
import AdminExperience from './admin/Experience';
import AdminEducation from './admin/Education';
import Sidebar from './admin/Sidebar';
import AIChatBot from './components/AIChatBot';
import { Menu, X, Sun, Moon } from 'lucide-react';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const FrontendLayout: React.FC = () => {
  const { incrementViews } = useApp();
  
  useEffect(() => {
    incrementViews();
  }, [incrementViews]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <AIChatBot />
    </div>
  );
};

const AdminLayout: React.FC = () => {
  const { auth, darkMode, toggleDarkMode } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const location = useLocation();

  // Close sidebar on navigation on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  if (!auth.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors relative overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} pl-0`}>
        <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm transition-colors">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="font-bold text-sm sm:text-lg truncate max-w-[120px] sm:max-w-none">Control Center</h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold leading-none">Administrator</p>
                <p className="text-xs text-gray-500 mt-1">Logged in as {auth.user}</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg text-sm">
                {auth.user?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-10 max-w-full overflow-x-hidden">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="experience" element={<AdminExperience />} />
            <Route path="education" element={<AdminEducation />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<FrontendLayout />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
