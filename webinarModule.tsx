
import React, { useState, useEffect } from 'react';
import { Webinar, UserRole, User } from './types';
import { db } from './db';

interface WebinarModuleProps {
  user: User;
}

const WebinarModule: React.FC<WebinarModuleProps> = ({ user }) => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newWebinar, setNewWebinar] = useState({ title: '', description: '', date: '', link: '' });

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const list = await db.getWebinars();
        setWebinars(list);
      } catch (err) {
        console.error('Failed to load webinars', err);
      }
    };
    fetchWebinars();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const webinar: Webinar = {
      id: Date.now(),
      ...newWebinar,
      speaker: user.name,
      status: user.role === UserRole.ADMIN ? 'approved' : 'pending'
    };
    try {
      const createdWebinar = await db.addWebinar(webinar);
      setWebinars(current => [...current, createdWebinar]);
    } catch (error) {
      console.error('Failed to create webinar', error);
      return;
    }
    setShowModal(false);
    setNewWebinar({ title: '', description: '', date: '', link: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Alumni Webinars</h2>
        {(user.role === UserRole.ALUMNI || user.role === UserRole.ADMIN) && (
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Host Webinar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {webinars.filter(w => w.status === 'approved' || user.role === UserRole.ADMIN).map(webinar => (
          <div key={webinar.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded">Live Session</div>
                {webinar.status === 'pending' && <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded">Pending Approval</span>}
              </div>
              <span className="text-xs text-slate-400 font-medium">{webinar.date}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{webinar.title}</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{webinar.description}</p>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                {webinar.speaker.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-slate-700">Hosted by {webinar.speaker}</span>
            </div>
            <a 
              href={webinar.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full text-center py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition"
            >
              Join Webinar
            </a>
          </div>
        ))}
        {webinars.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
             <p className="text-slate-400 font-medium italic">No upcoming webinars at the moment.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative animate-in zoom-in duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold mb-6">Host New Webinar</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Webinar Title</label>
                <input required className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-600" value={newWebinar.title} onChange={e => setNewWebinar({...newWebinar, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea required className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-600" rows={3} value={newWebinar.description} onChange={e => setNewWebinar({...newWebinar, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                  <input required type="datetime-local" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-600" value={newWebinar.date} onChange={e => setNewWebinar({...newWebinar, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Link</label>
                  <input required type="url" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-600" placeholder="https://" value={newWebinar.link} onChange={e => setNewWebinar({...newWebinar, link: e.target.value})} />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">Webinars hosted by Alumni require Admin approval before going live.</p>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">Schedule Webinar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebinarModule;
