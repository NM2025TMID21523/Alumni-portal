
import React, { useState } from 'react';
import { User, UserRole, MentorshipRequest } from './types';
import { mockAlumni } from './mockData';

interface MentorshipModuleProps {
  user: User;
  requests: MentorshipRequest[];
  onUpdateStatus: (id: string, status: 'accepted' | 'declined') => void;
  onSendRequest: (alumniId: string, alumniName: string) => void;
}

const MentorshipModule: React.FC<MentorshipModuleProps> = ({ user, requests, onUpdateStatus, onSendRequest }) => {
  const [showDirectory, setShowDirectory] = useState(false);

  const isAlumni = user.role === UserRole.ALUMNI;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mentorship Hub</h2>
          <p className="text-sm text-slate-500">
            {isAlumni 
              ? "Manage student requests and share your professional expertise." 
              : "Connect with alumni who can guide your career path."}
          </p>
        </div>
        {!isAlumni && (
          <button 
            onClick={() => setShowDirectory(!showDirectory)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            {showDirectory ? 'Back to Requests' : 'Find a Mentor'}
          </button>
        )}
      </div>

      {isAlumni ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Incoming Requests</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {requests.filter(r => r.alumniId === user.id || r.alumniId === '1').map(req => (
              <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                    {req.studentName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{req.studentName}</h4>
                    <p className="text-sm text-slate-500 italic">"{req.message}"</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {req.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => onUpdateStatus(req.id, 'accepted')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(req.id, 'declined')}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200 transition"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      req.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {requests.filter(r => r.alumniId === user.id || r.alumniId === '1').length === 0 && (
              <div className="p-12 text-center text-slate-400 italic">No incoming requests yet.</div>
            )}
          </div>
        </div>
      ) : (
        <>
          {showDirectory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-300">
              {mockAlumni.map(mentor => {
                const isRequested = requests.find(r => r.alumniId === mentor.id && r.studentId === 's100');
                return (
                  <div key={mentor.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto">
                      {mentor.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-slate-900 text-center">{mentor.name}</h3>
                    <p className="text-xs text-indigo-600 font-medium text-center mb-4 uppercase">{mentor.company} • {mentor.department}</p>
                    <button 
                      disabled={!!isRequested}
                      onClick={() => onSendRequest(mentor.id, mentor.name)}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition ${
                        isRequested ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                      }`}
                    >
                      {isRequested ? 'Request Sent' : 'Send Mentorship Request'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
                 <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">My Requests</h3>
                 <p className="text-sm text-slate-500 mb-6">Track the status of your sent mentorship invitations.</p>
                 <div className="space-y-3">
                   {requests.filter(r => r.studentId === 's100').map(r => (
                     <div key={r.id} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between text-left border border-slate-100">
                        <div>
                          <p className="text-xs font-bold text-slate-700">{r.alumniName}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">{r.status}</p>
                        </div>
                        <div className={`w-2.5 h-2.5 rounded-full ${r.status === 'pending' ? 'bg-amber-500 animate-pulse' : r.status === 'accepted' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                     </div>
                   ))}
                   {requests.filter(r => r.studentId === 's100').length === 0 && (
                     <p className="text-xs text-slate-400 italic">No sent requests yet.</p>
                   )}
                 </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col justify-center">
                 <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Mentorship Overview</h3>
                 <p className="text-sm text-slate-500 mb-6">Connect with industry leaders and accelerate your career.</p>
                 <button onClick={() => setShowDirectory(true)} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">Browse Mentors</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MentorshipModule;
