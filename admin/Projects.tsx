
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, X, 
  ExternalLink, Globe, Upload, Image as ImageIcon, 
  Trash, RefreshCw, Hash, Loader2, Github, CheckCircle2,
  AlertTriangle, AlertCircle, Wand2, Camera, Sparkles,
  Briefcase
} from 'lucide-react';
import { Project } from '../types';
import { suggestProjectDetails } from '../services/aiService';

const AdminProjects: React.FC = () => {
  const { data, updateData } = useApp();
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, title: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteTrigger = (id: string, title: string) => {
    setDeleteConfirmation({ id, title });
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    updateData({ projects: data.projects.filter(p => p.id !== deleteConfirmation.id) });
    setDeleteConfirmation(null);
  };

  const handleAiSuggest = async () => {
    if (!editingProject?.title?.trim()) {
      alert("Please enter a project title first.");
      return;
    }

    setIsAiLoading(true);
    try {
      const details = await suggestProjectDetails(editingProject.title);
      setEditingProject(prev => ({
        ...prev,
        description: details.description,
        techStack: details.tech
      }));
      setIsDirty(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    
    setIsProcessing(true);
    setUploadProgress(0);

    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    reader.onloadend = () => {
      setUploadProgress(100);
      setTimeout(() => {
        setEditingProject(prev => prev ? { ...prev, image: reader.result as string } : null);
        setIsProcessing(false);
        setIsDirty(true);
      }, 400);
    };

    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const addTag = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter' && e.key !== ',') return;
    if (e) e.preventDefault();
    const tag = tagInput.trim().replace(',', '');
    if (tag && !editingProject?.techStack?.includes(tag)) {
      handleFieldChange({ techStack: [...(editingProject?.techStack || []), tag] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleFieldChange({ techStack: editingProject?.techStack?.filter(t => t !== tagToRemove) });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (editingProject.id) {
      updateData({ projects: data.projects.map(p => p.id === editingProject.id ? (editingProject as Project) : p) });
    } else {
      updateData({ projects: [{ ...editingProject, id: Date.now().toString(), published: true, techStack: editingProject.techStack || [] } as Project, ...data.projects] });
    }
    setEditingProject(null);
    setIsDirty(false);
  };

  const handleFieldChange = (updates: Partial<Project>) => {
    setEditingProject(prev => prev ? { ...prev, ...updates } : null);
    setIsDirty(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Project Portfolio</h1>
          <p className="text-sm text-gray-500">Showcase your best work to the world.</p>
        </div>
        <button 
          onClick={() => setEditingProject({ title: '', category: 'Web', description: '', techStack: [], image: '', liveLink: '', githubLink: '' })} 
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.projects.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden group shadow-sm hover:shadow-xl transition-all">
            <div className="aspect-video relative bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <img src={p.image || 'https://via.placeholder.com/600x400?text=No+Image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.title} />
              {!p.published && <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center"><span className="text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-gray-800 rounded-full">Draft</span></div>}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-widest">{p.category}</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditingProject(p)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"><Edit2 size={14}/></button>
                  <button onClick={() => handleDeleteTrigger(p.id, p.title)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><Trash2 size={14}/></button>
                </div>
              </div>
              <h3 className="font-bold truncate text-gray-900 dark:text-white">{p.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mt-2">{p.description}</p>
            </div>
          </div>
        ))}
      </div>

      {editingProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 w-full max-w-5xl rounded-[2.5rem] p-6 sm:p-8 flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingProject.id ? 'Refine Project' : 'New Creation'}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Editor Console</p>
                </div>
              </div>
              <button onClick={() => setEditingProject(null)} className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all"><X size={24}/></button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Image & Tags */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider ml-1">Cover Imagery</label>
                    <div className="relative group/upload">
                      <div 
                        onClick={() => !isProcessing && fileInputRef.current?.click()} 
                        className={`relative cursor-pointer border-2 border-dashed rounded-[2.5rem] aspect-video flex items-center justify-center overflow-hidden transition-all duration-500 ${
                          editingProject.image ? 'border-transparent' : 'border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:bg-blue-50/10'
                        }`}
                      >
                        <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageChange} />
                        
                        {editingProject.image ? (
                          <>
                            <img src={editingProject.image} className={`w-full h-full object-cover transition-all duration-500 ${isProcessing ? 'blur-md scale-110' : 'group-hover/upload:scale-105'}`} alt="Preview" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-xl">
                                  <Camera size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Change Photo</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-gray-400">
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl">
                              <ImageIcon size={32} />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest">Click to upload</p>
                          </div>
                        )}

                        {isProcessing && (
                          <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center">
                            <Loader2 size={32} className="text-blue-600 animate-spin mb-3" />
                            <div className="text-xs font-black text-blue-600">{uploadProgress}%</div>
                            <div className="w-32 h-1 bg-gray-200 dark:bg-gray-800 rounded-full mt-3 overflow-hidden">
                              <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Tech Stack Ecosystem</label>
                      <Hash size={14} className="text-gray-300" />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                      {editingProject.techStack?.map((tag) => (
                        <div key={tag} className="group/tag flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[11px] font-bold shadow-sm transition-all hover:border-blue-200">
                          <span className="text-gray-700 dark:text-gray-300">{tag}</span>
                          <button 
                            type="button" 
                            onClick={() => removeTag(tag)} 
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-300 hover:text-red-500 rounded-lg transition-all"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="relative">
                      <input 
                        value={tagInput} 
                        onChange={(e) => setTagInput(e.target.value)} 
                        onKeyDown={addTag} 
                        placeholder="Type and press Enter..." 
                        className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 rounded-2xl text-xs font-medium border border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all" 
                      />
                      <button 
                        type="button"
                        onClick={() => addTag()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side: Details */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider ml-1">Project Identifier</label>
                      <input 
                        required 
                        placeholder="Epic Application Name"
                        value={editingProject.title} 
                        onChange={e => handleFieldChange({ title: e.target.value })} 
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-4 focus:ring-blue-600/5 text-sm font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider ml-1">Primary Category</label>
                      <select 
                        value={editingProject.category} 
                        onChange={e => handleFieldChange({ category: e.target.value as any })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-4 focus:ring-blue-600/5 text-sm font-bold appearance-none cursor-pointer"
                      >
                        <option value="Web">Web Application</option>
                        <option value="App">Mobile App</option>
                        <option value="Design">UI/UX Design</option>
                        <option value="Other">Special Project</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Project Narrative</label>
                      <button 
                        type="button" 
                        onClick={handleAiSuggest} 
                        disabled={isAiLoading} 
                        className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest disabled:opacity-50"
                      >
                        {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        Magic Auto-Draft
                      </button>
                    </div>
                    <textarea 
                      required 
                      rows={4} 
                      placeholder="What makes this project unique?"
                      value={editingProject.description} 
                      onChange={e => handleFieldChange({ description: e.target.value })} 
                      className="w-full px-6 py-5 rounded-[2rem] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-4 focus:ring-blue-600/5 resize-none text-sm leading-relaxed" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider ml-1">Live URL</label>
                      <div className="relative">
                        <Globe size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          value={editingProject.liveLink} 
                          onChange={e => handleFieldChange({ liveLink: e.target.value })} 
                          placeholder="https://app-demo.com"
                          className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-4 focus:ring-blue-600/5 text-xs font-medium" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider ml-1">Source Repository</label>
                      <div className="relative">
                        <Github size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          value={editingProject.githubLink} 
                          onChange={e => handleFieldChange({ githubLink: e.target.value })} 
                          placeholder="https://github.com/..."
                          className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-4 focus:ring-blue-600/5 text-xs font-medium" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex flex-col sm:flex-row gap-4">
                    <button 
                      type="button" 
                      onClick={() => setEditingProject(null)} 
                      className="flex-1 py-5 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-bold rounded-2xl text-sm transition-all hover:bg-gray-200 dark:hover:bg-gray-800 active:scale-95"
                    >
                      Discard Changes
                    </button>
                    <button 
                      type="submit" 
                      className="flex-[2] py-5 bg-blue-600 text-white font-black rounded-2xl text-sm shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} />
                      {editingProject.id ? 'Update Project Info' : 'Publish to Portfolio'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600 mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Permanent Removal?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">"{deleteConfirmation.title}"</span>? This action cannot be reversed.
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirmation(null)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
