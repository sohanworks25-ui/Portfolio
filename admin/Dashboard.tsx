
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Eye, Briefcase, MessageCircle, Star, ArrowRight, User, ExternalLink, ShieldCheck, Database, AlertCircle, Copy, Check, Terminal } from 'lucide-react';
import { checkDatabaseStatus } from '../services/supabase';

const AdminDashboard: React.FC = () => {
  const { data } = useApp();
  const [dbStatus, setDbStatus] = useState<{ exists: boolean; loading: boolean }>({ exists: true, loading: true });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const verifyDb = async () => {
      const status = await checkDatabaseStatus();
      setDbStatus({ exists: status.exists, loading: false });
    };
    verifyDb();
  }, []);

  const setupSQL = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.portfolio_state (
    id text PRIMARY KEY,
    data jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.portfolio_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public full access" ON public.portfolio_state
FOR ALL USING (true) WITH CHECK (true);`;

  const copySetupSQL = () => {
    navigator.clipboard.writeText(setupSQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { 
      name: 'Views', 
      value: data.analytics.totalViews.toLocaleString(), 
      icon: Eye, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100 dark:bg-blue-900/30', 
      path: '/admin/settings' 
    },
    { 
      name: 'Projects', 
      value: data.projects.filter(p => p.published).length, 
      icon: Briefcase, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-100 dark:bg-indigo-900/30', 
      path: '/admin/projects' 
    },
    { 
      name: 'Messages', 
      value: data.messages.filter(m => !m.read).length, 
      icon: MessageCircle, 
      color: 'text-green-600', 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      path: '/admin/messages' 
    },
    { 
      name: 'Testimonials', 
      value: data.testimonials.length, 
      icon: Star, 
      color: 'text-amber-600', 
      bg: 'bg-amber-100 dark:bg-amber-900/30', 
      path: '/admin/testimonials' 
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-full overflow-hidden">
      
      {/* Critical Action Banner for missing table */}
      {!dbStatus.loading && !dbStatus.exists && (
        <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center shadow-lg shadow-amber-600/5">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
            <AlertCircle size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-black text-amber-900 dark:text-amber-100">Database Table Missing</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1 font-medium">
              Your Supabase project is connected, but the <code className="bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded font-bold">portfolio_state</code> table needs to be initialized.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              onClick={copySetupSQL}
              className="px-6 py-3 bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 active:scale-95"
            >
              {copied ? <Check size={18} /> : <Terminal size={18} />}
              {copied ? 'SQL Copied!' : 'Copy Fix Script'}
            </button>
            <Link 
              to="/admin/settings"
              className="px-6 py-3 bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-900/40 transition-all active:scale-95"
            >
              Setup Guide
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">System Pulse</h1>
          <p className="text-sm text-gray-500 font-medium">Monitoring your portfolio's digital health.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <a 
            href="#/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            <ExternalLink size={16} /> Open Public Site
          </a>
        </div>
      </div>

      {/* Profile Quick Card */}
      <div className="p-0.5 sm:p-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-blue-600/20">
        <div className="bg-white dark:bg-gray-900 rounded-[1.8rem] sm:rounded-[2.4rem] p-5 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
           <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden ring-4 ring-gray-100 dark:ring-gray-800 shadow-xl shrink-0">
                 <img src={data.profile.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="text-center sm:text-left">
                 <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-tight">{data.profile.name}</h2>
                 <p className="text-blue-600 dark:text-blue-400 text-sm sm:text-base font-bold uppercase tracking-wider mt-1">{data.profile.designation}</p>
                 <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100/50 dark:border-emerald-800/50">
                       <ShieldCheck size={12} /> Live Status
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                       <Database size={10} className={dbStatus.exists ? "text-emerald-500" : "text-amber-500"} />
                       {dbStatus.exists ? "Database Connected" : "Local Sync Active"}
                    </span>
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <Link to="/admin/profile" className="flex-1 sm:flex-none text-center px-8 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl text-sm font-black transition-all border border-gray-100 dark:border-gray-700 active:scale-95">
                 Edit Identity
              </Link>
              <Link to="/admin/projects" className="flex-1 sm:flex-none text-center px-8 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95">
                 Manage Projects
              </Link>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {stats.map((stat) => (
          <Link 
            key={stat.name} 
            to={stat.path}
            className="p-5 sm:p-8 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden active:scale-95"
          >
            <div className={`p-3 sm:p-4 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-5 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-2xl sm:text-4xl font-black mb-1 leading-none tracking-tighter">{stat.value}</h3>
            <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">{stat.name}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
        <div className="lg:col-span-2 p-6 sm:p-10 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <h3 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              Traffic Analytics
            </h3>
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500">
               Last 7 Operating Days
            </div>
          </div>
          <div className="h-[250px] sm:h-[350px] w-full -ml-4 sm:-ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.analytics.viewHistory}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} width={40} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '15px'}}
                  cursor={{stroke: '#2563eb', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 sm:p-10 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-full">
          <h3 className="text-lg sm:text-xl font-black mb-8 flex items-center gap-3">
            <MessageCircle size={24} className="text-blue-600" /> 
            Recent Leads
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] lg:max-h-none pr-1 custom-scrollbar">
            {data.messages.slice(0, 5).map((msg) => (
              <div key={msg.id} className="group relative flex items-center gap-5 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                <div className={`w-12 h-12 rounded-2xl ${msg.read ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white'} flex items-center justify-center font-black shrink-0 transition-all shadow-lg`}>
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold truncate ${!msg.read ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>{msg.name}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest truncate mt-1">{msg.subject}</p>
                </div>
              </div>
            ))}
            {data.messages.length === 0 && (
              <div className="text-center py-16 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-200">
                  <MessageCircle size={32} />
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">Inbox Clear</p>
              </div>
            )}
          </div>
          <Link 
            to="/admin/messages" 
            className="mt-8 block w-full py-5 text-center text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-2xl transition-all active:scale-95"
          >
            View All Communications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
