
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center">
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-2 mb-4 justify-center md:justify-start">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-lg font-bold">KPRCAS Alumni Portal</span>
            </div>
            <p className="text-slate-400 max-w-md text-center md:text-left mx-auto md:mx-0">
              KPR College of Arts Science and Research <br/>
              Empowering the next generation through innovation and connection.
            </p>
            <div className="mt-3">
              <a 
                href="https://kprcas.ac.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-indigo-400 hover:text-indigo-300 font-bold text-sm flex items-center gap-2 transition justify-start"
              >
                Go to Official Website
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          <div className="md:text-right text-slate-400 space-y-2 text-sm">
            <p className="flex md:justify-end items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              Avinashi Road, Arasur, Coimbatore - 641407
            </p>
            <p className="flex md:justify-end items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              info@kprcas.ac.in
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
