
import React from 'react';

interface HeroProps {
  onAction: (type: 'login' | 'register') => void;
}

const Hero: React.FC<HeroProps> = ({ onAction }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Styled to match the night-lit campus building from the provided photo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105"
        style={{ 
          backgroundImage: 'url(https://kprcas.ac.in/file/wp-content/uploads/2024/12/kprcas-2048x912.jpg)',
          backgroundAttachment: 'fixed'
        }}
      >
        
        {/* Dark overlay with slight tint to match the night atmosphere */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-brightness-110"></div>
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-white" style={{ maxWidth: '1400px' }}>
        <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold tracking-[0.2em] uppercase animate-in fade-in slide-in-from-top-4 duration-1000">
          Smart Online Alumni Platform
        </div>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter animate-in slide-in-from-bottom-8 duration-700">
          Reconnect. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Engage. Excel.</span>
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 mb-12 max-w-5xl mx-auto leading-relaxed opacity-95 font-medium">
          The official gateway for alumni and students to collaborate, 
          mentor, and build a legacy of professional excellence together.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <button 
            onClick={() => onAction('register')}
            className="group relative w-full sm:w-56 px-10 py-4 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-2xl shadow-indigo-900/40 transition-all hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10">Register</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
          <button 
            onClick={() => onAction('login')}
            className="w-full sm:w-56 px-10 py-4 text-lg bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:bg-white/20 text-white font-bold rounded-2xl transition-all hover:-translate-y-1"
          >
            Join
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
