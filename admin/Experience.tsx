
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, History, Save, Edit2, X, Briefcase, AlertTriangle } from 'lucide-react';
import { Experience } from '../types';

const AdminExperience: React.FC = () => {
  const { data, updateData } = useApp();
  const [experiences, setExperiences] = useState<Experience[]>(data.experience);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, title: string } | null>(null);

  const handleSaveList = () => {
    updateData({ experience: experiences });
    setHasChanges(false);
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    const newList = experiences.filter(exp => exp.id !== deleteConfirmation.id);
    setExperiences(newList);
    setHasChanges(true);
    setDeleteConfirmation(null);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    if (editingExp.id) {
      setExperiences(experiences.map(exp => exp.id === editingExp.id ? (editingExp as Experience) : exp));
    } else {
      setExperiences([{ ...editingExp, id: Date.now().toString() } as Experience, ...experiences]);
    }
    setEditingExp(null);
    setHasChanges(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Work Experience</h1>
          <p className="text-sm text-gray-500">Manage your professional history for the About section.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setEditingExp({ company: '', role: '', period: '', description: '' })}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
          >
            <Plus size={18} /> Add New
          </button>
          {hasChanges && (
            <button 
              onClick={handleSaveList} 
              className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all animate-bounce"
            >
              <Save size={18} /> Save All Changes
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50 dark:divide-gray-700">
          {experiences.map((exp) => (
            <div key={exp.id} className="p-6 flex items-start gap-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                <Briefcase size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{exp.role}</h4>
                    <p className="text-sm text-blue-600 font-semibold">{exp.company}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{exp.period}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingExp(exp)} 
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit2 size={18}/>
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmation({ id: exp.id, title: `${exp.role} at ${exp.company}` })} 
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
          {experiences.length === 0 && (
            <div className="p-24 text-center">
              <History size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 italic">No experience entries found. Add your first job!</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600 mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Remove Entry?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete the entry for <span className="font-bold text-gray-900 dark:text-white">"{deleteConfirmation.title}"</span>?
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirmation(null)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">Remove</button>
            </div>
          </div>
        </div>
      )}

      {editingExp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingExp.id ? 'Edit Experience' : 'Add New Experience'}</h2>
              <button onClick={() => setEditingExp(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={20}/>
              </button>
            </div>
            <form onSubmit={handleSaveModal} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Job Title / Role</label>
                  <input 
                    required 
                    value={editingExp.role} 
                    onChange={e => setEditingExp({...editingExp, role: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="e.g. Senior Developer" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Company Name</label>
                  <input 
                    required 
                    value={editingExp.company} 
                    onChange={e => setEditingExp({...editingExp, company: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="e.g. Google" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Time Period</label>
                <input 
                  required 
                  value={editingExp.period} 
                  onChange={e => setEditingExp({...editingExp, period: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="e.g. Jan 2021 - Present" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Key Responsibilities</label>
                <textarea 
                  required 
                  rows={4} 
                  value={editingExp.description} 
                  onChange={e => setEditingExp({...editingExp, description: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all" 
                  placeholder="Describe your achievements and tasks..." 
                />
              </div>
              <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                {editingExp.id ? 'Update Entry' : 'Create Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExperience;
