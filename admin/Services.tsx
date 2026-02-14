
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Layers, Save, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Service } from '../types';

const AdminServices: React.FC = () => {
  const { data, updateData } = useApp();
  const [services, setServices] = useState<Service[]>(data.services);
  const [newService, setNewService] = useState({ title: '', description: '', icon: 'Code', enabled: true });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, title: string } | null>(null);

  const handleAdd = () => {
    if (!newService.title) return;
    const added = [...services, { ...newService, id: Date.now().toString() }];
    setServices(added);
    setNewService({ title: '', description: '', icon: 'Code', enabled: true });
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    setServices(services.filter(s => s.id !== deleteConfirmation.id));
    setDeleteConfirmation(null);
  };

  const handleToggle = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSave = () => {
    updateData({ services });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors">
          <Save size={18} /> Save Services
        </button>
      </div>

      <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
        <div className="space-y-4 bg-gray-50 dark:bg-gray-900/40 p-6 rounded-2xl">
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">Add New Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="Service Title" 
              value={newService.title} 
              onChange={e => setNewService({...newService, title: e.target.value})}
              className="px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <select 
              value={newService.icon} 
              onChange={e => setNewService({...newService, icon: e.target.value})}
              className="px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Code">Code</option>
              <option value="Palette">Palette</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Globe">Globe</option>
              <option value="Layers">Layers</option>
              <option value="Cpu">Cpu</option>
            </select>
          </div>
          <textarea 
            placeholder="Description" 
            value={newService.description} 
            onChange={e => setNewService({...newService, description: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all" 
            rows={2}
          />
          <button onClick={handleAdd} className="w-full h-12 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
            <Plus size={18} /> Add Service
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {services.map((service) => (
            <div key={service.id} className="flex items-center gap-6 p-4 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                <Layers size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold">{service.title}</h4>
                <p className="text-xs text-gray-500 truncate">{service.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleToggle(service.id)}
                  className={`p-2 rounded-lg transition-colors ${service.enabled ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-gray-400 bg-gray-50 dark:bg-gray-900/40'}`}
                  title={service.enabled ? "Disable" : "Enable"}
                >
                  {service.enabled ? <CheckCircle size={20} /> : <XCircle size={20} />}
                </button>
                <button onClick={() => setDeleteConfirmation({ id: service.id, title: service.title })} className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {services.length === 0 && <div className="text-center py-10 text-gray-400 italic">No services added yet</div>}
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Service?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to remove the <span className="font-bold text-gray-900 dark:text-white">"{deleteConfirmation.title}"</span> service?
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

export default AdminServices;
