
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, MentorshipRequest, Webinar, GalleryImage, AlumniEvent, AppNotification } from '../types';
import { db } from '../services/db';
import AlumniSearch from '../components/AlumniSearch';
import WebinarModule from '../components/WebinarModule';

import PhotoGallery from '../components/PhotoGallery';
import AdminModule from '../components/AdminModule';
import DigitalID from '../components/DigitalID';
import CommunityModule from '../components/CommunityModule';
import MessagesModule from '../components/MessagesModule';
import ThemeToggle from '../components/ThemeToggle';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'search' | 'community' | 'messages' | 'webinars' | 'gallery' | 'admin'>('overview');
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [events, setEvents] = useState<AlumniEvent[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [notificationPopup, setNotificationPopup] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    setIsDataLoading(true);
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Data loading timeout')), 5000)
      );
      
      const [reqs, webs, gals, evs, notifs] = await Promise.race([
        Promise.all([
          db.getRequests().catch(e => { console.error('Error loading requests:', e); return []; }),
          db.getWebinars().catch(e => { console.error('Error loading webinars:', e); return []; }),
          db.getGallery().catch(e => { console.error('Error loading gallery:', e); return []; }),
          db.getEvents().catch(e => { console.error('Error loading events:', e); return []; }),
          db.getNotifications(user.id).catch(e => { console.error('Error loading notifications:', e); return []; })
        ]),
        timeoutPromise
      ]);
      
      setRequests(reqs || []);
      setWebinars(webs || []);
      setGallery(gals || []);
      setEvents(evs || []);
      setNotifications(notifs || []);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
      setRequests([]);
      setWebinars([]);
      setGallery([]);
      setEvents([]);
      setNotifications([]);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
        db.getNotifications(user.id).then(setNotifications);
    }, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMentorshipRequest = async (alumniId: string, alumniName: string) => {
    const exists = requests.find(r => r.alumniId === alumniId && r.studentId === user.id);
    if (exists) {
      setNotificationPopup({ message: `Request already sent to ${alumniName}`, type: 'error' });
      return;
    }

    const newRequest: MentorshipRequest = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: user.id,
      studentName: user.name,
      alumniId: alumniId,
      alumniName: alumniName,
      status: 'pending',
      message: `I'd love to connect and learn more about your journey.`
    };

    await db.addRequest(newRequest);
    await loadData();
    setNotificationPopup({ message: `Mentorship request sent to ${alumniName}!`, type: 'success' });
  };

  const handleUpdateStatus = async (id: string, status: 'accepted' | 'declined') => {
    await db.updateRequestStatus(id, status);
    await loadData();
    setNotificationPopup({ message: `Mentorship request ${status}.`, type: 'success' });
  };

  const handleMarkRead = async (id: string) => {
    await db.markNotificationRead(id);
    const updated = await db.getNotifications(user.id);
    setNotifications(updated);
  };

  const handleClearNotifications = async () => {
    await db.clearAllNotifications(user.id);
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const SidebarItem = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: React.ReactNode }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition font-medium ${
        activeTab === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {notificationPopup && (
        <div className={`fixed top-4 right-4 z-[200] px-6 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-3 border ${
          notificationPopup.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
        }`}>
          <span className="font-bold text-sm">{notificationPopup.message}</span>
          <button onClick={() => setNotificationPopup(null)} className="text-white/50 hover:text-white">×</button>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col p-6 sticky top-0 h-auto md:h-screen z-40 shrink-0 border-r border-slate-800">
        <div className="flex items-center space-x-2 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-black">A</div>
          <span className="font-bold text-xl tracking-tight">Portal Hub</span>
        </div>

        <nav className="flex-grow space-y-2 overflow-y-auto custom-scrollbar">
          <SidebarItem id="overview" label="Overview" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
          <SidebarItem id="community" label="Community Hub" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
          <SidebarItem id="messages" label="Messages" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>} />
          <SidebarItem id="search" label="Network" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>} />

          <SidebarItem id="webinars" label="Webinars" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} />
          <SidebarItem id="gallery" label="Gallery" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
          {user.role === UserRole.ADMIN && <SidebarItem id="admin" label="Admin" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>} />}
        </nav>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className={`text-3xl font-bold capitalize ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{activeTab === 'community' ? 'Community Hub' : activeTab}</h1>
            <p className="text-slate-500">Welcome, {user.name}. Stay connected.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-3 border rounded-2xl shadow-sm hover:shadow-md transition relative group ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                <svg className={`w-6 h-6 transition ${theme === 'dark' ? 'text-slate-500 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-4 w-80 rounded-3xl shadow-2xl border overflow-hidden z-[100] animate-in slide-in-from-top-4 duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                  <div className={`p-4 border-b flex justify-between items-center ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                    <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
                    <button onClick={handleClearNotifications} className="text-[10px] font-black text-indigo-400 uppercase hover:underline">Clear All</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => handleMarkRead(n.id)}
                          className={`p-4 border-b hover:bg-opacity-50 transition cursor-pointer flex gap-4 ${theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-50 hover:bg-slate-50'} ${!n.isRead ? theme === 'dark' ? 'bg-indigo-900/10' : 'bg-indigo-50/30' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            n.type === 'mentorship' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                            n.type === 'community' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {n.type === 'mentorship' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> : 
                               n.type === 'community' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> : 
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />}
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{n.title}</p>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{n.message}</p>
                            <p className="text-[9px] text-slate-400 mt-1 font-medium">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          {!n.isRead && <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 shrink-0"></div>}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-xs text-slate-500 italic">No notifications yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="hidden md:flex" />
          </div>
        </header>

        {isDataLoading ? (
          <div className="flex-grow flex items-center justify-center py-20">
            <div className={`w-10 h-10 border-4 rounded-full animate-spin ${theme === 'dark' ? 'border-slate-800 border-t-indigo-500' : 'border-indigo-100 border-t-indigo-600'}`}></div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-8">
                  <div className={`rounded-3xl p-8 border shadow-sm flex flex-col md:flex-row gap-8 items-center transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex-grow">
                      <h2 className={`text-2xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>My Digital Identity</h2>
                      <p className="text-slate-500 mb-6">Access your official digital credentials anytime.</p>
                      <button 
                        onClick={() => setActiveTab('community')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-900/20"
                      >
                        Visit Community Hub
                      </button>
                    </div>
                    <div className="shrink-0 w-full max-w-xs">
                       <DigitalID user={user} />
                    </div>
                  </div>

                  <div className={`rounded-3xl p-8 border shadow-sm transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Upcoming Events</h3>
                    <div className="space-y-4">
                      {events.map((ev, i) => (
                        <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                          <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                             <span className="text-xs font-black text-indigo-500">{ev.date.split('-')[2]}</span>
                             <span className="text-[10px] uppercase font-bold text-slate-500">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</span>
                          </div>
                          <div>
                            <h4 className={`font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{ev.title}</h4>
                            <p className="text-xs text-slate-500">{ev.location} • {ev.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'community' && <CommunityModule user={user} />}
            {activeTab === 'messages' && <MessagesModule user={user} />}
            {activeTab === 'search' && <AlumniSearch onConnect={handleSendMentorshipRequest} />}
            {activeTab === 'webinars' && <WebinarModule user={user} />}
            {activeTab === 'gallery' && <PhotoGallery user={user} />}
            {activeTab === 'admin' && <AdminModule />}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
