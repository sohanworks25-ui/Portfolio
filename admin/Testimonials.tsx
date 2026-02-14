
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Star, Save, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Testimonial } from '../types';

const AdminTestimonials: React.FC = () => {
  const { data, updateData } = useApp();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(data.testimonials);
  const [newT, setNewT] = useState({ clientName: '', feedback: '', clientPhoto: 'https://picsum.photos/100/100', published: true });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, name: string } | null>(null);

  const handleAdd = () => {
    if (!newT.clientName || !newT.feedback) return;
    const added = [...testimonials, { ...newT, id: Date.now().toString() }];
    setTestimonials(added);
    setNewT({ clientName: '', feedback: '', clientPhoto: 'https://picsum.photos/100/100', published: true });
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    setTestimonials(testimonials.filter(t => t.id !== deleteConfirmation.id));
    setDeleteConfirmation(null);
  };

  const handleToggle = (id: string) => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, published: !t.published } : t));
  };

  const handleSave = () => {
    updateData({ testimonials });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Testimonials</h1>
        <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors">
          <Save size={18} /> Save Testimonials
        </button>
      </div>

      <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
        <div className="space-y-4 bg-gray-50 dark:bg-gray-900/40 p-6 rounded-2xl">
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">Add New Testimonial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="Client Name" 
              value={newT.clientName} 
              onChange={e => setNewT({...newT, clientName: e.target.value})}
              className="px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <input 
              placeholder="Photo URL" 
              value={newT.clientPhoto} 
              onChange={e => setNewT({...newT, clientPhoto: e.target.value})}
              className="px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <textarea 
            placeholder="Feedback content..." 
            value={newT.feedback} 
            onChange={e => setNewT({...newT, feedback: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all" 
            rows={3}
          />
          <button onClick={handleAdd} className="w-full h-12 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
            <Plus size={18} /> Add Testimonial
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="flex items-center gap-6 p-4 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
              <img src={t.clientPhoto} alt={t.clientName} className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-100 dark:border-gray-700" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm">{t.clientName}</h4>
                <p className="text-xs text-gray-500 italic line-clamp-2">"{t.feedback}"</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleToggle(t.id)}
                  className={`p-2 rounded-lg transition-colors ${t.published ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 bg-gray-50 dark:bg-gray-900/40'}`}
                  title={t.published ? "Unpublish" : "Publish"}
                >
                  {t.published ? <CheckCircle size={20} /> : <XCircle size={20} />}
                </button>
                <button onClick={() => setDeleteConfirmation({ id: t.id, name: t.clientName })} className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && <div className="text-center py-10 text-gray-400 italic">No testimonials added yet</div>}
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Testimonial?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to remove the feedback from <span className="font-bold text-gray-900 dark:text-white">"{deleteConfirmation.name}"</span>?
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

export default AdminTestimonials;
