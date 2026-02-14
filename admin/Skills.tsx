
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Zap, Save, AlertTriangle } from 'lucide-react';
import { Skill } from '../types';

const AdminSkills: React.FC = () => {
  const { data, updateData } = useApp();
  const [skills, setSkills] = useState<Skill[]>(data.skills);
  const [newSkill, setNewSkill] = useState({ name: '', percentage: 80 });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, name: string } | null>(null);

  const handleAdd = () => {
    if (!newSkill.name) return;
    const added = [...skills, { ...newSkill, id: Date.now().toString() }];
    setSkills(added);
    setNewSkill({ name: '', percentage: 80 });
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    setSkills(skills.filter(s => s.id !== deleteConfirmation.id));
    setDeleteConfirmation(null);
  };

  const handleSave = () => {
    updateData({ skills });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Skills</h1>
        <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors">
          <Save size={18} /> Save All Skills
        </button>
      </div>

      <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-gray-50 dark:bg-gray-900/40 p-6 rounded-2xl">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Skill Name</label>
            <input 
              value={newSkill.name} 
              onChange={e => setNewSkill({...newSkill, name: e.target.value})}
              placeholder="e.g. React" 
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Percentage ({newSkill.percentage}%)</label>
            <input 
              type="range" min="0" max="100" 
              value={newSkill.percentage} 
              onChange={e => setNewSkill({...newSkill, percentage: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <button onClick={handleAdd} className="h-12 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
            <Plus size={18} /> Add Skill
          </button>
        </div>

        <div className="space-y-4">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-6 p-4 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                <Zap size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{skill.name}</span>
                  <span className="text-sm font-bold text-blue-600">{skill.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${skill.percentage}%` }}></div>
                </div>
              </div>
              <button onClick={() => setDeleteConfirmation({ id: skill.id, name: skill.name })} className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {skills.length === 0 && (
            <div className="text-center py-10 text-gray-400 italic">No skills added yet</div>
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Skill?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-white">"{deleteConfirmation.name}"</span>?
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirmation(null)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSkills;
