
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { mockAlumni, departments } from '../services/mockData';

interface AlumniSearchProps {
  onConnect?: (alumniId: string, alumniName: string) => void;
}

const AlumniSearch: React.FC<AlumniSearchProps> = ({ onConnect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  const filteredAlumni = useMemo(() => {
    return mockAlumni.filter(a => {
      const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = deptFilter ? a.department === deptFilter : true;
      const matchYear = yearFilter ? a.batch === yearFilter : true;
      const matchCompany = companyFilter ? a.company?.toLowerCase().includes(companyFilter.toLowerCase()) : true;
      return matchSearch && matchDept && matchYear && matchCompany;
    });
  }, [searchTerm, deptFilter, yearFilter, companyFilter]);

  const batches = useMemo(() => [...new Set(mockAlumni.map(a => a.batch))].sort(), []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-indigo-600 outline-none transition"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-indigo-600 outline-none transition"
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-indigo-600 outline-none transition"
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
          >
            <option value="">All Batches</option>
            {batches.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <input 
            type="text" 
            placeholder="Filter by company..." 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-indigo-600 outline-none transition"
            value={companyFilter}
            onChange={e => setCompanyFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {filteredAlumni.map(alumni => (
          <div key={alumni.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-100 transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition">
                {alumni.name.charAt(0)}
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                Batch {alumni.batch}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{alumni.name}</h3>
            <p className="text-xs text-indigo-600 font-medium mb-3">{alumni.department}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {alumni.company || 'Private'}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {alumni.email}
              </div>
            </div>

            <button 
              onClick={() => onConnect?.(alumni.id, alumni.name)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition shadow-sm"
            >
              Connect
            </button>
          </div>
        ))}
        {filteredAlumni.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-medium">No alumni found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniSearch;
