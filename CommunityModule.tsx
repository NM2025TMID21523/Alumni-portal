
import React, { useState, useEffect } from 'react';
import { User, CommunityPost } from '../types';
import { db } from '../services/db';

interface CommunityModuleProps {
  user: User;
}

const CommunityModule: React.FC<CommunityModuleProps> = ({ user }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [postInput, setPostInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    const fetchedPosts = await db.getPosts();
    setPosts(fetchedPosts);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postInput.trim()) return;

    const newPost: CommunityPost = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content: postInput,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    await db.addPost(newPost);
    setPosts([newPost, ...posts]);
    setPostInput('');
  };

  return (
    <div className="flex flex-col gap-6 h-[700px] overflow-hidden animate-in fade-in duration-500 pb-10">
      {/* Main content area */}
      <div className="flex-grow bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex flex-col h-full">
          {/* Post Creation */}
          <div className="p-6 border-b border-slate-100">
            <form onSubmit={handlePostSubmit} className="flex gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold shrink-0">{user.name.charAt(0)}</div>
              <div className="flex-grow space-y-3">
                <textarea 
                  value={postInput}
                  onChange={e => setPostInput(e.target.value)}
                  placeholder="Share an update, achievement, or question with the community..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-indigo-600 focus:bg-white transition resize-none"
                  rows={2}
                />
                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">Post update</button>
                </div>
              </div>
            </form>
          </div>

          {/* Posts List */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {posts.map(post => (
              <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
                      {post.authorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{post.authorName}</h4>
                      <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">{post.authorRole}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{new Date(post.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                  <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {post.likes} Likes
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Comment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityModule;
