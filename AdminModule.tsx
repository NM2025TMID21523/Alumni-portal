
import React, { useState, useEffect, useMemo } from 'react';
import { User, Webinar, AlumniEvent, Announcement, FundraisingCampaign, Donor, GalleryImage } from './types';
import { db } from './db';

const AdminModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'users' | 'approvals' | 'events' | 'campus' | 'fundraising' | 'gallery'>('dashboard');
  
  // Data States from DB
  const [users, setUsers] = useState<User[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [events, setEvents] = useState<AlumniEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [campaigns, setCampaigns] = useState<FundraisingCampaign[]>([]);

  // Local Form States
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ title: '', description: '', targetAmount: 0, startDate: '', endDate: '' });

  // Correctly handle async data fetching from the database service
  const refreshData = async () => {
    try {
      const [u, w, g, c, e] = await Promise.all([
        db.getUsers(),
        db.getWebinars(),
        db.getGallery(),
        db.getCampaigns(),
        db.getEvents()
      ]);
      setUsers(u);
      setWebinars(w);
      setGallery(g);
      setCampaigns(c);
      setEvents(e);
    } catch (error) {
      console.error("Error refreshing admin data:", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Ensure database operations are awaited before refreshing the UI state
  const handleApproveUser = async (id: string) => {
    await db.updateUser(id, { status: 'approved' });
    await refreshData();
  };

  const handleApproveWebinar = async (id: string) => {
    await db.updateWebinarStatus(id, 'approved');
    await refreshData();
  };

  const handleApproveGallery = async (id: string) => {
    await db.approveImage(id);
    await refreshData();
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const campaign: FundraisingCampaign = { 
      id: Date.now(), 
      title: newCampaign.title,
      description: newCampaign.description,
      goal_amount: newCampaign.targetAmount,
      current_amount: 0,
      created_at: new Date().toISOString(),
      status: 'active' 
    };
    await db.addCampaign(campaign);
    await refreshData();
    setShowCampaignModal(false);
  };

  const stats = useMemo(() => {
    const pendingUsrs = users.filter((u: User) => u.status === 'pending');
    const pendingWebs = webinars.filter((w: Webinar) => w.status === 'pending');
    const pendingGals = gallery.filter((g: GalleryImage) => g.status === 'pending');

    return {
      totalUsers: users.length,
      pendingApprovals: pendingUsrs.length + pendingWebs.length + pendingGals.length,
      // Fix: Use the events state which is properly awaited, instead of the promise-returning db call
      activeEvents: events.length,
      totalRaised: campaigns.reduce((acc: number, c: FundraisingCampaign) => acc + (c.current_amount || 0), 0)
    };
  }, [users, webinars, gallery, campaigns, events]);

  const pendingUsers = users.filter((u: User) => u.status === 'pending');

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-24">
      <aside className="w-full lg:w-56 shrink-0 space-y-1">
        {(['dashboard', 'users', 'approvals', 'events', 'campus', 'fundraising', 'gallery'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold capitalize transition-all ${
              activeSubTab === tab 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'text-slate-500 hover:bg-white hover:text-slate-900'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </aside>

      <div className="flex-grow space-y-8 min-w-0">
        {activeSubTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: stats.totalUsers, color: 'indigo', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                { label: 'Pending Requests', value: stats.pendingApprovals, color: 'amber', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Active Events', value: stats.activeEvents, color: 'emerald', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { label: 'Funds Raised', value: `$${stats.totalRaised.toLocaleString()}`, color: 'blue', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Pending Activity</h3>
              <div className="space-y-6">
                {pendingUsers.slice(0, 3).map(u => (
                  <div key={u.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">{u.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{u.name} requested to join</p>
                        <p className="text-xs text-slate-400">Alumni • Batch {u.batch}</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveSubTab('approvals')} className="text-xs font-bold text-indigo-600 hover:underline">Review</button>
                  </div>
                ))}
                {pendingUsers.length === 0 && <p className="text-sm text-slate-400 italic">No pending user registrations.</p>}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">User Directory</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="text-sm hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                      <td className="px-6 py-4 capitalize text-slate-500">{u.role.toLowerCase()}</td>
                      <td className="px-6 py-4 text-slate-500">{u.department}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${u.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {u.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 hover:text-indigo-800 font-bold text-xs">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSubTab === 'approvals' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-600">Pending Registrations</h3>
                 <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">{pendingUsers.length} Pending</span>
               </div>
               <div className="divide-y divide-slate-100">
                 {pendingUsers.map(u => (
                   <div key={u.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                     <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl">{u.name.charAt(0)}</div>
                       <div>
                         <h4 className="font-bold text-slate-900">{u.name}</h4>
                         <p className="text-xs text-slate-500">Batch {u.batch} • {u.department} • {u.company}</p>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => handleApproveUser(u.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition">Approve</button>
                       <button className="px-4 py-2 bg-slate-100 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-50 transition">Reject</button>
                     </div>
                   </div>
                 ))}
                 {pendingUsers.length === 0 && <div className="p-12 text-center text-slate-400">All registrations handled.</div>}
               </div>
            </section>

            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-600">Webinar Requests</h3>
                 <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">{webinars.filter(w => w.status === 'pending').length} Pending</span>
               </div>
               <div className="divide-y divide-slate-100">
                 {webinars.filter(w => w.status === 'pending').map(w => (
                   <div key={w.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                     <div>
                       <h4 className="font-bold text-slate-900">{w.title}</h4>
                       <p className="text-xs text-slate-500">Requested by {w.speaker} • {w.date}</p>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => handleApproveWebinar(w.id.toString())} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition">Approve</button>
                       <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition">Dismiss</button>
                     </div>
                   </div>
                 ))}
               </div>
            </section>
          </div>
        )}

        {activeSubTab === 'fundraising' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Active Campaigns</h2>
              <button onClick={() => setShowCampaignModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Launch Campaign
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {campaigns.map(c => (
                <div key={c.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{c.title}</h4>
                  <p className="text-sm text-slate-500 mb-8 line-clamp-2">{c.description}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <span>Progress</span>
                      <span>{Math.round(((c.current_amount ?? 0) / (c.goal_amount ?? 1)) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${((c.current_amount ?? 0) / (c.goal_amount ?? 1)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl font-black text-slate-900">${(c.current_amount ?? 0).toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Goal: ${(c.goal_amount ?? 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition">Manage Drive</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'gallery' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="text-2xl font-bold text-slate-900">Moderation Queue</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map(img => (
                <div key={img.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group">
                  <div className="relative aspect-video">
                    <img src={img.url} className="w-full h-full object-cover" />
                    {img.status === 'pending' && (
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <div className="flex gap-2">
                          <button onClick={() => handleApproveGallery(img.id.toString())} className="p-3 bg-emerald-600 text-white rounded-full hover:scale-110 transition"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{img.date}</p>
                    <h4 className="font-bold text-slate-900 mt-1">{img.caption}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showCampaignModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative animate-in zoom-in duration-200">
            <button onClick={() => setShowCampaignModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h3 className="text-xl font-bold mb-6">Launch Fundraising Drive</h3>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Campaign Title</label>
                <input required className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" value={newCampaign.title} onChange={e => setNewCampaign({...newCampaign, title: e.target.value})} placeholder="e.g. Science Lab Upgrade" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea required rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" value={newCampaign.description} onChange={e => setNewCampaign({...newCampaign, description: e.target.value})} placeholder="Why are we raising money?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Goal ($)</label>
                  <input required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" value={newCampaign.targetAmount} onChange={e => setNewCampaign({...newCampaign, targetAmount: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input required type="date" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-600" value={newCampaign.endDate} onChange={e => setNewCampaign({...newCampaign, endDate: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">Publish Campaign</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModule;
