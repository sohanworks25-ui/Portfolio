
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trash2, MailOpen, Mail, Clock, AlertTriangle, 
  X, User, Calendar, Tag, ChevronRight, MessageCircle,
  CheckCircle2, Reply, Wand2, Loader2
} from 'lucide-react';
import { Message } from '../types';
import { draftMessageReply } from '../services/aiService';

const AdminMessages: React.FC = () => {
  const { data, markMessageRead, deleteMessage } = useApp();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, name: string } | null>(null);
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState('');

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    deleteMessage(deleteConfirmation.id);
    if (viewingMessage?.id === deleteConfirmation.id) setViewingMessage(null);
    setDeleteConfirmation(null);
  };

  const handleOpenMessage = (msg: Message) => {
    setViewingMessage(msg);
    setAiDraft('');
    if (!msg.read) {
      markMessageRead(msg.id);
    }
  };

  const handleAiDraft = async () => {
    if (!viewingMessage) return;
    setIsAiLoading(true);
    try {
      const draft = await draftMessageReply(viewingMessage.message, viewingMessage.name, data);
      setAiDraft(draft || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const unreadCount = data.messages.filter(m => !m.read).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Message Inbox</h1>
          <p className="text-sm text-gray-500">Communication received from your portfolio visitors.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-2">
            <MessageCircle size={16} className="text-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{unreadCount} New</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {data.messages.length > 0 ? (
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {data.messages.map((msg) => (
              <div key={msg.id} onClick={() => handleOpenMessage(msg)} className={`group p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer relative ${!msg.read ? 'bg-blue-50/20 dark:bg-blue-900/10' : ''}`}>
                {!msg.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${!msg.read ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-400'}`}>
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-base font-bold ${!msg.read ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>{msg.name}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-2">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32"><Mail size={48} className="mx-auto text-gray-200 mb-4" /><p className="text-gray-400 italic">No messages yet</p></div>
        )}
      </div>

      {viewingMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-8 pb-6 flex items-start justify-between">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">{viewingMessage.name.charAt(0).toUpperCase()}</div>
                   <div>
                      <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{viewingMessage.name}</h2>
                      <p className="text-sm text-blue-600">{viewingMessage.email}</p>
                   </div>
                </div>
                <button onClick={() => setViewingMessage(null)} className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6 custom-scrollbar">
                 <div className="p-6 bg-blue-50/30 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100/50">
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Subject: {viewingMessage.subject}</h3>
                    <div className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{viewingMessage.message}</div>
                 </div>

                 {aiDraft && (
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-800 animate-in slide-in-from-bottom-2">
                       <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Wand2 size={12} /> AI Drafted Reply
                       </h3>
                       <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                         {aiDraft}
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4">
                 <button onClick={handleAiDraft} disabled={isAiLoading} className="flex-1 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-gray-100 disabled:opacity-50">
                    {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} className="text-blue-600" />}
                    Draft AI Reply
                 </button>
                 <a href={`mailto:${viewingMessage.email}?subject=Re: ${viewingMessage.subject}&body=${encodeURIComponent(aiDraft)}`} className="flex-[1.5] py-4 bg-blue-600 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all">
                    <Reply size={18} /> Send Official Reply
                 </a>
              </div>
           </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-center mb-8">Delete Message?</h2>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirmation(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl text-sm">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl text-sm">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
