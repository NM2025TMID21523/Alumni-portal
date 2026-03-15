
import React from 'react';

const features = [
  {
    title: "Alumni Engagement",
    description: "Foster meaningful connections with peers and juniors through high-impact networking events and reunions at KPRCAS.",
    icon: (
      <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: "Mentorship",
    description: "Bridge the gap between students and industry experts from our alumni network. Gain direct guidance on career choices.",
    icon: (
      <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    title: "Career Support",
    description: "Exclusive access to a dedicated job board, career guidance, and placement updates from top recruiters.",
    icon: (
      <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-950 relative transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12" style={{ maxWidth: '1400px' }}>

        <div className="text-center mb-20">
          <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4">About KPRCAS</h2>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
            Our Purpose & Values
          </h3>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-4xl mx-auto text-lg md:text-xl lg:text-2xl mb-10 leading-relaxed">
            KPR College of Arts Science and Research is dedicated to empowering students and alumni 
            through shared knowledge and community-driven success.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://kprcas.ac.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-4 text-base bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-900/20"
            >
              Learn More
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="p-10 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 transition duration-300 group">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition duration-300">
                {feature.icon}
              </div>
              <h4 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h4>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
