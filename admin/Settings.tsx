
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  Save, Globe, Lock, ShieldCheck, Image as ImageIcon, 
  Link as LinkIcon, ArrowRight, Database, Download, 
  Terminal, Code2, Copy, Check, AlertCircle, ServerCrash
} from 'lucide-react';
import { generateDataExportSQL } from '../services/sqlService';
import { checkDatabaseStatus } from '../services/supabase';

const AdminSettings: React.FC = () => {
  const { data, updateData } = useApp();
  const [settings, setSettings] = useState({
    siteName: data.siteName,
    logo: data.logo,
    metaTitle: data.seo.metaTitle,
    metaDescription: data.seo.metaDescription,
    keywords: data.seo.keywords,
    faviconUrl: data.seo.faviconUrl
  });
  const [success, setSuccess] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ exists: boolean; loading: boolean }>({ exists: true, loading: true });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const verifyDb = async () => {
      const status = await checkDatabaseStatus();
      setDbStatus({ exists: status.exists, loading: false });
    };
    verifyDb();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({
      siteName: settings.siteName,
      logo: settings.logo,
      seo: {
        ...data.seo,
        metaTitle: settings.metaTitle,
        metaDescription: settings.metaDescription,
        keywords: settings.keywords,
        faviconUrl: settings.faviconUrl
      }
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const setupSQL = `-- 1. Create the portfolio_state table
CREATE TABLE IF NOT EXISTS public.portfolio_state (
    id text PRIMARY KEY,
    data jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_state ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow the public anon key to manage data
-- Note: In production, consider more restrictive policies.
CREATE POLICY "Allow public full access" ON public.portfolio_state
FOR ALL USING (true) WITH CHECK (true);`;

  const copySetupSQL = () => {
    navigator.clipboard.writeText(setupSQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">General Settings</h1>
          <p className="text-sm text-gray-500">Configure your website's primary information and SEO.</p>
        </div>
        {success && (
          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800 animate-in slide-in-from-right-4">
            <ShieldCheck size={16} /> Settings saved!
          </div>
        )}
      </div>

      {!dbStatus.loading && !dbStatus.exists && (
        <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
            <AlertCircle size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">Database Setup Required</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              Your Supabase backend is connected, but the <strong>portfolio_state</strong> table is missing. 
              Run the SQL script below in your Supabase SQL Editor to fix this.
            </p>
          </div>
          <button 
            onClick={copySetupSQL}
            className="px-6 py-3 bg-amber-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-amber-700 transition-all shrink-0 shadow-lg shadow-amber-600/20"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'SQL Copied!' : 'Copy Setup SQL'}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Website Name</label>
              <input 
                value={settings.siteName}
                onChange={e => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="Sohan's Portfolio"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Logo Text</label>
              <input 
                value={settings.logo}
                onChange={e => setSettings({...settings, logo: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="Sohan."
              />
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Globe size={18} /> Search Engine Optimization (SEO)
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Meta Title</label>
                  <input 
                    value={settings.metaTitle}
                    onChange={e => setSettings({...settings, metaTitle: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    placeholder="Sohan | Full Stack Developer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Favicon URL</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        value={settings.faviconUrl}
                        onChange={e => setSettings({...settings, faviconUrl: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        placeholder="https://example.com/favicon.ico"
                      />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                      {settings.faviconUrl ? (
                        <img src={settings.faviconUrl} alt="Favicon Preview" className="w-6 h-6 object-contain" />
                      ) : (
                        <ImageIcon size={20} className="text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Meta Description</label>
                <textarea 
                  rows={3}
                  value={settings.metaDescription}
                  onChange={e => setSettings({...settings, metaDescription: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all" 
                  placeholder="Tell search engines what your site is about..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Database size={18} /> Database Studio
            </h3>
            
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-2">Supabase Sync Status</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${dbStatus.exists ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {dbStatus.loading ? 'Checking...' : dbStatus.exists ? 'Synced & Active' : 'Table Not Found'}
                  </span>
                </div>
                <p className="text-xs text-emerald-700/70 dark:text-emerald-300/60 leading-relaxed mb-4">
                  Your current content is always backed up to LocalStorage. Syncing to Supabase provides a permanent remote backend for multi-device access.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    type="button" 
                    onClick={() => {
                      const sql = generateDataExportSQL(data);
                      const blob = new Blob([sql], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `portfolio_backup.sql`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all"
                  >
                    <Code2 size={14} /> Full SQL Backup
                  </button>
                  <button 
                    type="button" 
                    onClick={copySetupSQL}
                    className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
                  >
                    <Terminal size={14} /> View Setup SQL
                  </button>
                </div>
              </div>
              <div className="hidden lg:flex w-24 h-24 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center text-emerald-600 shrink-0">
                <Database size={40} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95">
              <Save size={20} />
              Save Global Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
