
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Footer from '../components/Footer';
import AuthForm from '../components/AuthForm';
import { UserRole, User } from '../types';

interface LandingPageProps {
  onLogin: (user: User) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, theme, toggleTheme }) => {
  const [showAuth, setShowAuth] = useState<{ type: 'login' | 'register' | 'forgot'; role: UserRole } | null>(null);

  return (
    <>
      <Navbar 
        onJoinClick={() => setShowAuth({ type: 'login', role: UserRole.STUDENT })} 
        onRegisterClick={() => setShowAuth({ type: 'register', role: UserRole.STUDENT })} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-grow min-h-screen flex flex-col">
        <Hero onAction={(type) => setShowAuth({ type, role: UserRole.STUDENT })} />
        <About />
        {/* ensure footer at bottom when content is short */}
        <div className="mt-auto" />
      </main>

      <Footer />

      {showAuth && (
        <AuthForm 
          type={showAuth.type}
          defaultRole={showAuth.role}
          onSuccess={onLogin}
          onClose={() => setShowAuth(null)}
          onForgotPassword={() => setShowAuth({ type: 'forgot', role: UserRole.STUDENT })}
          theme={theme}
        />
      )}
    </>
  );
};

export default LandingPage;
