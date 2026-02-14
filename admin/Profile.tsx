
import React, { useState, useRef, useMemo, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { useApp } from '../context/AppContext';
import { 
  Save, Camera, Github, Linkedin, Twitter, Mail, 
  Upload, Loader2, CheckCircle2, FileText, Trash2, 
  Facebook, Instagram, Youtube, Dribbble, Sliders,
  Link as LinkIcon, Sparkles, RefreshCcw, ShieldCheck,
  User, Phone, Lock, Key, Eye, EyeOff, AlertTriangle, X, ShieldAlert,
  UserCog, Fingerprint, Shield, AlignLeft, Clock, Briefcase, Plus, Globe,
  Slack, Disc, Twitch, MessageSquare, Send, 
  Music, Pin, Ghost, Share2, Layers as Behance, PenTool as Figma, 
  Video, Coffee, BookOpen, Wand2, ShieldEllipsis, AlertCircle, 
  Crop, Maximize, ZoomIn, RotateCw, Check
} from 'lucide-react';
import { SocialLink } from '../types';
import { refineProfileText } from '../services/aiService';

// Image Cropping Utilities
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  const safeArea = Math.max(image.width, image.height) * 2;

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5,
    image.width,
    image.height
  );

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.putImageData(data, 0, 0);

  const resultCanvas = document.createElement('canvas');
  const resultCtx = resultCanvas.getContext('2d');

  if (!resultCtx) return '';

  resultCanvas.width = pixelCrop.width;
  resultCanvas.height = pixelCrop.height;

  resultCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return resultCanvas.toDataURL('image/jpeg');
};

const AdminProfile: React.FC = () => {
  const { data, updateData } = useApp();
  const [profile, setProfile] = useState(data.profile);
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState<'bio' | 'about' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Photo Studio State
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Credentials Change State
  const [isCredsModalOpen, setIsCredsModalOpen] = useState(false);
  const [credData, setCredData] = useState({ 
    currentPassword: '', 
    newUsername: data.adminCredentials?.username || 'admin', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [credError, setCredError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: any, _pixelCrop: any) => {
    setCroppedAreaPixels(_pixelCrop);
  }, []);

  const handleApplyCrop = async () => {
    if (imageToCrop && croppedAreaPixels) {
      setIsProcessing(true);
      try {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels, rotation);
        setProfile(prev => ({ ...prev, photoUrl: croppedImage }));
        setImageToCrop(null);
        setZoom(1);
        setRotation(0);
      } catch (e) {
        console.error(e);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const passwordStrength = useMemo(() => {
    const pass = credData.newPassword;
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
    return score;
  }, [credData.newPassword]);

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 1: return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
      case 2: return { label: 'Fair', color: 'bg-orange-500', text: 'text-orange-500' };
      case 3: return { label: 'Good', color: 'bg-amber-500', text: 'text-amber-500' };
      case 4: return { label: 'Strong', color: 'bg-blue-600', text: 'text-blue-600' };
      case 5: return { label: 'Excellent', color: 'bg-emerald-500', text: 'text-emerald-500' };
      default: return { label: 'Too Short', color: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-400' };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({ profile });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleAiRefine = async (field: 'bio' | 'aboutMe') => {
    const originalText = profile[field];
    if (!originalText.trim()) return;
    setIsAiLoading(field === 'bio' ? 'bio' : 'about');
    try {
      const refined = await refineProfileText(originalText, field === 'bio' ? 'bio' : 'about');
      if (refined) setProfile(prev => ({ ...prev, [field]: refined }));
    } catch (err) {
      console.error("AI Refine Error:", err);
    } finally {
      setIsAiLoading(null);
    }
  };

  const handleCredentialsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError('');
    const storedCreds = data.adminCredentials || { username: 'admin', password: 'admin123' };
    if (credData.currentPassword !== storedCreds.password) {
      setCredError('Current password is incorrect');
      return;
    }
    updateData({
      adminCredentials: {
        username: credData.newUsername,
        password: credData.newPassword || storedCreds.password
      }
    });
    setIsCredsModalOpen(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageToCrop(reader.result?.toString() || null));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageToCrop(reader.result?.toString() || null));
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Profile</h1>
          <p className="text-sm text-gray-500">Update your personal identity and professional assets.</p>
        </div>
        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-100 dark:border-emerald-800 animate-in slide-in-from-right-4">
            <CheckCircle2 size={16} /> Changes saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={80} className="text-blue-600" />
            </div>
            
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-8">Identity Asset</h3>
            
            <div className="flex flex-col items-center">
              <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className="relative z-10">
                <div className={`relative w-56 h-56 transition-all duration-500 ${isDragging ? 'scale-105 rotate-3' : 'hover:scale-[1.02]'}`}>
                  <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-20 blur-2xl rounded-full animate-pulse"></div>
                  <div className="absolute -inset-1 bg-gradient-to-tr from-blue-400/30 to-indigo-400/30 blur-md rounded-[3.5rem]"></div>
                  
                  <div className={`w-full h-full bg-white dark:bg-gray-900 rounded-[3.5rem] overflow-hidden relative ring-8 transition-all ${isDragging ? 'ring-blue-500 ring-offset-4 dark:ring-offset-gray-800 shadow-2xl' : 'ring-gray-50 dark:ring-gray-800 shadow-xl'}`}>
                    <img src={profile.photoUrl} alt="Avatar" className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${isProcessing ? 'blur-sm' : ''}`} />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-14 h-14 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center text-blue-600 shadow-xl ring-4 ring-gray-50 dark:ring-gray-800 hover:scale-110 active:scale-95 transition-all z-20 group/btn">
                    <Camera size={24} />
                  </button>
                </div>
              </div>
              <p className="mt-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Supports Drag & Drop</p>
            </div>
          </div>

          {/* Account Security Card */}
          <div className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
               <ShieldCheck size={20} className="text-blue-600" /> Account Security
            </h3>
            <p className="text-sm text-gray-500">
              Manage your login credentials and administrative access.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Username</p>
                  <p className="text-sm font-semibold">{data.adminCredentials?.username || 'admin'}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsCredsModalOpen(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                >
                  <Lock size={18} />
                </button>
              </div>
              <button 
                type="button"
                onClick={() => setIsCredsModalOpen(true)}
                className="w-full py-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
              >
                <Key size={18} /> Update Credentials
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
            <div className="space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                 <User size={20} className="text-blue-600" /> General Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Public Name</label>
                  <input name="name" required value={profile.name} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Expertise Title</label>
                  <input name="designation" required value={profile.designation} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Professional Email</label>
                  <input name="email" required type="email" value={profile.email} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Contact Phone</label>
                  <input name="phone" required value={profile.phone} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Short Bio (Hero)</label>
                  <button 
                    type="button" 
                    onClick={() => handleAiRefine('bio')}
                    disabled={isAiLoading === 'bio'}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest"
                  >
                    {isAiLoading === 'bio' ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                    AI Refine
                  </button>
                </div>
                <textarea name="bio" required value={profile.bio} onChange={handleChange} rows={2} className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all" />
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-gray-700">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                    <AlignLeft size={20} className="text-blue-600" /> About Me Content
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => handleAiRefine('aboutMe')}
                    disabled={isAiLoading === 'about'}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest"
                  >
                    {isAiLoading === 'about' ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                    AI Refine
                  </button>
                </div>
                <textarea name="aboutMe" required value={profile.aboutMe} onChange={handleChange} rows={6} className="w-full px-6 py-5 rounded-[2rem] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all leading-relaxed" />
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-gray-700">
              <button className="w-full py-5 bg-blue-600 text-white font-bold rounded-[1.5rem] shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all">
                <Save size={22} /> Save Profile Changes
              </button>
            </div>
          </div>
        </div>
      </form>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {/* Photo Studio Modal (Unique Enhancements) */}
      {imageToCrop && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-gray-900 w-full max-w-4xl h-[90vh] rounded-[3rem] overflow-hidden flex flex-col relative shadow-2xl animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                     <Crop size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight">Photo Studio</h2>
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Crop & Refine Image</p>
                  </div>
               </div>
               <button 
                  onClick={() => setImageToCrop(null)}
                  className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all"
               >
                  <X size={24} />
               </button>
            </div>

            {/* Cropper Container */}
            <div className="flex-1 relative bg-gray-950/50">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>

            {/* Controls */}
            <div className="p-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                       <ZoomIn size={14} /> Zoom Level
                    </span>
                    <span className="text-xs font-black text-blue-600">{Math.round(zoom * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full appearance-none accent-blue-600 cursor-pointer"
                  />

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                       <RotateCw size={14} /> Rotation
                    </span>
                    <span className="text-xs font-black text-blue-600">{rotation}°</span>
                  </div>
                  <input 
                    type="range"
                    value={rotation}
                    min={0}
                    max={360}
                    step={1}
                    aria-labelledby="Rotation"
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full appearance-none accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col justify-center gap-4">
                   <button 
                      onClick={handleApplyCrop}
                      className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all"
                   >
                      {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                      Set as Profile Picture
                   </button>
                   <button 
                      onClick={() => setImageToCrop(null)}
                      className="w-full py-5 bg-gray-50 dark:bg-gray-800 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                   >
                      Cancel Changes
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {isCredsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setIsCredsModalOpen(false)} className="absolute top-6 right-6 p-2 text-gray-400"><X size={24} /></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                <ShieldEllipsis size={32} />
              </div>
              <h2 className="text-xl font-bold">Security Center</h2>
            </div>
            <form onSubmit={handleCredentialsUpdate} className="space-y-5">
              {credError && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs">{credError}</div>}
              <input 
                required 
                type="password"
                value={credData.currentPassword}
                onChange={e => setCredData({...credData, currentPassword: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Current Password"
              />
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <input 
                  required 
                  value={credData.newUsername}
                  onChange={e => setCredData({...credData, newUsername: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="New Username"
                />
                <input 
                  type="password"
                  value={credData.newPassword}
                  onChange={e => setCredData({...credData, newPassword: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="New Password (Optional)"
                />
              </div>
              <button className="w-full py-5 bg-blue-600 text-white font-bold rounded-[1.5rem] shadow-xl hover:bg-blue-700 transition-all">Update Credentials</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
