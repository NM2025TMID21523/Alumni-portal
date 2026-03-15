
import React from 'react';
import { User } from './types';

interface DigitalIDProps {
  user: User;
}

const DigitalID: React.FC<DigitalIDProps> = ({ user }) => {
  return (
    <div className="relative w-full max-w-sm mx-auto group">
      <div className="absolute inset-0 bg-indigo-600 blur-3xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
      <div className="relative bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl p-8 text-white aspect-[1.6/1]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-600/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-xl font-black tracking-tight">KPRCAS</h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em]">Official Alumni</p>
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <span className="font-black text-indigo-400">ID</span>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shadow-lg">
             <div className="w-full h-full bg-slate-900 rounded-[calc(1rem-2px)] flex items-center justify-center font-black text-3xl">
                {user.name.charAt(0)}
             </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold leading-tight">{user.name}</h4>
            <p className="text-xs text-indigo-400 font-semibold">{user.role}</p>
            <div className="pt-2 flex gap-4">
              <div>
                <p className="text-[8px] text-slate-500 uppercase font-bold">Batch</p>
                <p className="text-xs font-bold">{user.batch || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[8px] text-slate-500 uppercase font-bold">Dept</p>
                <p className="text-xs font-bold truncate max-w-[80px]">{user.department || 'General'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-end">
          <div className="space-y-1">
            <div className="w-24 h-4 bg-slate-800 rounded animate-pulse"></div>
            <p className="text-[8px] text-slate-500 font-bold uppercase">Auth Signature</p>
          </div>
          <div className="bg-white p-1 rounded-md">
            {/* Mock QR Code */}
            <div className="w-10 h-10 bg-slate-900 grid grid-cols-3 gap-0.5">
              {Array.from({length: 9}).map((_, i) => (
                <div key={i} className={`w-full h-full ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button className="mt-6 w-full py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        Download Digital Card
      </button>
    </div>
  );
};

export default DigitalID;
