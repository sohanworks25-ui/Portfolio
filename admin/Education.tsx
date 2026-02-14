
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, GraduationCap, Save, Edit2, X, School, Check, AlertTriangle } from 'lucide-react';
import { Education } from '../types';

const AdminEducation: React.FC = () => {
  const { data, updateData } = useApp();
  const [educations, setEducations] = useState<Education[]>(data.education);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, title: string } | null>(null);

  const handleSaveList = () => {
    updateData({ education: educations });
    setHasChanges(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    const newList = educations.filter(edu => edu.id !== deleteConfirmation.id);
    setEducations(newList);
    setHasChanges(true);
    setDeleteConfirmation(null);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;

    if (editingEdu.id) {
      setEducations(educations.map(edu => edu.id === editingEdu.id ? (editingEdu as Education) : edu));
    } else {
      setEducations([{ ...editingEdu, id: Date.now().toString() } as Education, ...educations]);
    }
    setEditingEdu(null);
    setHasChanges(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Academic Background</h1>
          <p className="text-sm text-gray-500">Manage your degrees and certifications.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setEditingEdu({ institution: '', degree: '', period: '' })}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={18} /> Add Entry
          </button>
          {hasChanges && (
            <button 
              onClick={handleSaveList} 
              className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all animate-bounce"
            >
              <Save size={18} /> Save All
            </button>
          )}
        </div>
      </div>

      {showSavedToast && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 border border-emerald-100 animate-in slide-in-from-top-2">
          <Check size={20} className="bg-emerald-500 text-white rounded-full p-0.5" />
          <p className="font-bold text-sm">Education data saved to your portfolio!</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50 dark:divide-gray-700">
          {educations.map((edu) => (
            <div key={edu.id} className="p-6 flex items-start gap-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center shrink-0">
                <School size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg leading-tight">{edu.degree}</h4>
                    <p className="text-sm text-indigo-600 font-semibold mt-1">{edu.institution}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2 font-medium">
                      <span>{edu.period}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingEdu(edu)} 
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                    >
                      <Edit2 size={18}/>
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmation({ id: edu.id, title: `${edu.degree} from ${edu.institution}` })} 
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {educations.length === 0 && (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200 dark:text-gray-700">
                <GraduationCap size={48} />
              </div>
              <p className="text-gray-400 italic">Your educational history is empty. Click "Add Entry" to begin.</p>
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Remove Education?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">"{deleteConfirmation.title}"</span>?
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirmation(null)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {editingEdu && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingEdu.id ? 'Edit Education' : 'Add New Education'}</h2>
              <button onClick={() => setEditingEdu(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={20}/>
              </button>
            </div>
            <form onSubmit={handleSaveModal} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Degree / Certification</label>
                <input 
                  required 
                  value={editingEdu.degree} 
                  onChange={e => setEditingEdu({...editingEdu, degree: e.target.value})} 
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="e.g. B.S. in Computer Science" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Institution / School</label>
                <input 
                  required 
                  value={editingEdu.institution} 
                  onChange={e => setEditingEdu({...editingEdu, institution: e.target.value})} 
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="e.g. Stanford University" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Time Period</label>
                <input 
                  required 
                  value={editingEdu.period} 
                  onChange={e => setEditingEdu({...editingEdu, period: e.target.value})} 
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="e.g. 2016 - 2020" 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingEdu(null)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-600">
                  Cancel
                </button>
                <button className="flex-2 py-4 px-8 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                  {editingEdu.id ? 'Save Changes' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEducation;
