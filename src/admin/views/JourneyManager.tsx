import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  X,
  History,
  Calendar,
  Building2,
  Briefcase,
  Check,
  Loader2
} from "lucide-react";
import { cn } from "../../lib/utils";

export function JourneyManager() {
  const [experience, setExperience] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    date: "",
    desc: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const snap = await getDoc(doc(db, "portfolio", "data"));
    if (snap.exists()) {
      setExperience(snap.data().experience || []);
    }
    setLoading(false);
  }

  const openModal = (index: number | null = null) => {
    setSaveStatus('idle');
    if (index !== null) {
      setEditingIndex(index);
      setFormData({ ...experience[index] });
    } else {
      setEditingIndex(null);
      setFormData({ role: "", company: "", date: "", desc: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [...experience];
    if (editingIndex !== null) {
      updated[editingIndex] = formData;
    } else {
      updated.push(formData);
    }

    setSaveStatus('saving');
    try {
      await updateDoc(doc(db, "portfolio", "data"), { experience: updated });
      setExperience(updated);
      setSaveStatus('saved');
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveStatus('idle');
      }, 1500);
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus('idle');
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    const updated = experience.filter((_, i) => i !== index);
    try {
      await updateDoc(doc(db, "portfolio", "data"), { experience: updated });
      setExperience(updated);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-5xl space-y-8 pb-20">
      <div className="flex justify-between items-center bg-surface/30 backdrop-blur-xl border border-stroke p-8 rounded-[2rem]">
         <div>
            <h2 className="text-xl font-display italic text-text-primary">Work Experience</h2>
            <p className="text-[10px] font-mono text-muted uppercase tracking-[0.3em] mt-1">Manage your career timeline</p>
         </div>
         <button 
           onClick={() => openModal()}
           className="bg-text-primary text-bg px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:accent-gradient transition-all shadow-lg"
         >
            <Plus className="w-4 h-4" /> Add Experience
         </button>
      </div>

      <div className="space-y-4">
         {experience.map((event, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: i * 0.05 }}
             className="bg-surface/30 backdrop-blur-xl border border-stroke p-6 rounded-2xl flex items-center justify-between group hover:border-[#89AACC]/40 transition-all"
           >
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-xl bg-bg border border-stroke flex items-center justify-center text-[#89AACC] group-hover:scale-110 transition-transform">
                    <History className="w-5 h-5 opacity-40" />
                 </div>
                 <div>
                    <div className="flex items-center gap-3">
                       <p className="text-[10px] font-mono font-bold text-[#89AACC] uppercase tracking-widest">{event.date}</p>
                       <div className="w-1 h-1 rounded-full bg-stroke" />
                       <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{event.company}</span>
                    </div>
                    <h3 className="text-lg font-display italic text-text-primary group-hover:text-[#89AACC] transition-colors">{event.role}</h3>
                 </div>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                 <button 
                   onClick={() => openModal(i)}
                   className="w-10 h-10 rounded-xl bg-bg border border-stroke flex items-center justify-center text-muted hover:text-[#89AACC] transition-all"
                 >
                    <Edit3 className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => handleDelete(i)}
                   className="w-10 h-10 rounded-xl bg-bg border border-stroke flex items-center justify-center text-muted hover:text-red-400 transition-all"
                 >
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
         {isModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-bg/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface border border-stroke w-full max-w-lg rounded-[2.5rem] relative z-10 p-10 overflow-hidden shadow-2xl"
              >
                 <div className="flex justify-between items-center mb-10">
                    <div>
                       <h2 className="text-2xl font-display italic text-text-primary">{editingIndex !== null ? "Edit Experience" : "Add Experience"}</h2>
                       <p className="text-[10px] font-mono text-muted uppercase tracking-[0.3em] mt-1">Status: Editing</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                       <X className="w-5 h-5 text-muted" />
                    </button>
                 </div>

                 <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-4">
                       <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC] flex items-center gap-2"><Briefcase className="w-3 h-3" /> Job Title</label>
                       <input 
                         required
                         type="text" 
                         value={formData.role}
                         onChange={(e) => setFormData({...formData, role: e.target.value})}
                         className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono"
                         placeholder="e.g. Software Engineer"
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC] flex items-center gap-2"><Building2 className="w-3 h-3" /> Company Name</label>
                       <input 
                         required
                         type="text" 
                         value={formData.company}
                         onChange={(e) => setFormData({...formData, company: e.target.value})}
                         className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono"
                         placeholder="e.g. Google"
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC] flex items-center gap-2"><Calendar className="w-3 h-3" /> Duration (Dates)</label>
                       <input 
                         required
                         type="text" 
                         value={formData.date}
                         onChange={(e) => setFormData({...formData, date: e.target.value})}
                         className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono"
                         placeholder="e.g. 2024 - Present"
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC]">Job Description</label>
                       <textarea 
                         rows={4}
                         value={formData.desc}
                         onChange={(e) => setFormData({...formData, desc: e.target.value})}
                         className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono resize-none leading-relaxed"
                         placeholder="Key achievements..."
                       />
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-stroke">
                       <button 
                         type="button" 
                         onClick={() => setIsModalOpen(false)}
                         className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted hover:text-text-primary"
                       >
                          Cancel
                       </button>
                       <button 
                         type="submit"
                         disabled={saveStatus !== 'idle'}
                         className={cn(
                           "min-w-[160px] px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all justify-center flex items-center gap-2",
                           saveStatus === 'saved' ? "bg-emerald-500 text-white" : "bg-text-primary text-bg hover:accent-gradient"
                         )}
                       >
                          {saveStatus === 'saving' && <Loader2 className="w-4 h-4 animate-spin text-bg" />}
                          {saveStatus === 'saved' && <Check className="w-4 h-4 text-white" />}
                          {saveStatus === 'idle' && <Plus className="w-4 h-4 text-bg" />}
                          {saveStatus === 'idle' ? "Save Experience" : saveStatus === 'saving' ? "Saving..." : "Experience Saved!"}
                       </button>
                    </div>
                 </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}
