
import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  onJoinClick: () => void;
  onRegisterClick: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onJoinClick, onRegisterClick, theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? theme === 'dark' ? 'bg-slate-950/90 border-b border-slate-800' : 'bg-white/95 border-b border-slate-100'
        : 'bg-transparent'
    } py-3 sm:py-4 backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={scrollToTop}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition duration-300">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className={`text-xl font-black tracking-tighter transition-colors duration-300 ${
              isScrolled ? theme === 'dark' ? 'text-white' : 'text-slate-900' : 'text-white'
            }`}>
              AlumniPortal
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest">
            <button 
              onClick={scrollToTop}
              className={`transition-colors duration-300 hover:text-indigo-600 ${
                isScrolled ? theme === 'dark' ? 'text-slate-300' : 'text-slate-600' : 'text-slate-200'
              }`}
            >
              Home
            </button>
            <button 
              onClick={onJoinClick} 
              className={`transition-colors duration-300 hover:text-indigo-600 ${
                isScrolled ? theme === 'dark' ? 'text-slate-300' : 'text-slate-600' : 'text-slate-200'
              }`}
            >
              Join
            </button>
            <button 
              onClick={onRegisterClick} 
              className={`transition-colors duration-300 hover:text-indigo-600 ${
                isScrolled ? theme === 'dark' ? 'text-slate-300' : 'text-slate-600' : 'text-slate-200'
              }`}
            >
              Register
            </button>
            
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="ml-4" />
          </div>

          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button 
              onClick={onJoinClick} 
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                isScrolled 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-white/20 backdrop-blur-md text-white border border-white/30'
              }`}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
