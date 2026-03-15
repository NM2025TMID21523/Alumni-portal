import React, { useState, useEffect, useRef } from 'react';
import { User, PrivateMessage } from './types';
import { db } from './db';

interface MessagesModuleProps {
  user: User;
}

const MessagesModule: React.FC<MessagesModuleProps> = ({ user }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [convoMessages, setConvoMessages] = useState<PrivateMessage[]>([]);
  const [msgInput, setMsgInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUsers().catch(error => {
      console.error('Failed to load users', error);
    });
  }, []);

  useEffect(() => {
    if (selectedContact) {
      loadConversation().catch(error => {
        console.error('Failed to load conversation', error);
      });
    }
  }, [selectedContact]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convoMessages]);

  const loadUsers = async () => {
    const fetchedUsers = await db.getUsers();
    setAllUsers(fetchedUsers.filter(u => u.id !== user.id));
  };

  const loadConversation = async () => {
    if (!selectedContact) return;
    const messages = await db.getMessages(user.id, selectedContact.id);
    setConvoMessages(messages);
  };

  const handleMsgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedContact) return;

    const newMsg: PrivateMessage = {
      id: Date.now(),
      sender_id: parseInt(user.id),
      receiver_id: parseInt(selectedContact.id),
      content: msgInput,
      created_at: new Date().toISOString(),
      read_status: false
    };

    const createdMessage = await db.sendMessage(newMsg);
    setConvoMessages([...convoMessages, createdMessage]);
    setMsgInput('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[700px] overflow-hidden animate-in fade-in duration-500 pb-10">
      {/* Contacts Sidebar */}
      <aside className="w-full lg:w-64 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col shrink-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Messages</h3>
          <p className="text-xs text-slate-500">Direct conversations</p>
        </div>
        
        <div className="flex-grow overflow-y-auto p-3 space-y-1">
          <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacts</p>
          {allUsers.map(u => (
            <button 
              key={u.id} 
              onClick={() => setSelectedContact(u)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                selectedContact?.id === u.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs uppercase text-slate-400 shrink-0">
                {u.name.charAt(0)}
              </div>
              <div className="text-left overflow-hidden">
                <p className="truncate">{u.name}</p>
                <p className="text-[10px] text-slate-400 font-medium capitalize">{u.role.toLowerCase()}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-grow bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold">{selectedContact.name.charAt(0)}</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedContact.name}</h4>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {convoMessages.map(msg => (
                <div key={msg.id} className={`flex ${String(msg.senderId || msg.sender_id) === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    String(msg.senderId || msg.sender_id) === user.id 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                  }`}>
                    {msg.text || msg.content}
                    <p className={`text-[8px] mt-1 text-right font-medium ${String(msg.senderId || msg.sender_id) === user.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {new Date(msg.timestamp || msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleMsgSubmit} className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <input 
                type="text" 
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                placeholder={`Message ${selectedContact.name.split(' ')[0]}...`}
                className="flex-grow bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm outline-none focus:border-indigo-600 shadow-sm transition"
              />
              <button type="submit" className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
               <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <h4 className="text-xl font-bold text-slate-900">Your Messages</h4>
            <p className="text-slate-500 max-w-xs mx-auto text-sm">Select a contact from the sidebar to start a private conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesModule;
