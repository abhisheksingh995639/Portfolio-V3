import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Save, User, FileText, BarChart3, Check, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export function IdentityEditor() {
  const [formData, setFormData] = useState<any>({
    tagline: "",
    resumeUrl: "",
    about: "",
    stats: {
      stat1Value: "",
      stat2Value: "",
      stat3Value: ""
    }
  });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    async function loadData() {
      const snap = await getDoc(doc(db, "portfolio", "data"));
      if (snap.exists()) {
        const d = snap.data();
        setFormData({
          tagline: d.general?.tagline || "",
          resumeUrl: d.general?.resumeUrl || "",
          about: d.general?.about || "",
          stats: d.general?.stats || { stat1Value: "", stat2Value: "", stat3Value: "" }
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      await updateDoc(doc(db, "portfolio", "data"), {
        "general.tagline": formData.tagline,
        "general.resumeUrl": formData.resumeUrl,
        "general.about": formData.about,
        "general.stats": formData.stats
      });
      setSaveStatus('saved');
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus('idle');
    } finally {
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div className="bg-surface/30 backdrop-blur-xl border border-stroke p-10 rounded-[2.5rem]">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-[#89AACC]/10 rounded-2xl border border-[#89AACC]/20">
            <User className="w-5 h-5 text-[#89AACC]" />
          </div>
          <div>
            <h2 className="text-xl font-display italic text-text-primary">Personal Profile</h2>
            <p className="text-[10px] font-mono text-muted uppercase tracking-[0.3em] mt-1">Information for Abhishek Singh</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#89AACC] ml-1 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Short Tagline (Hero)
              </label>
              <input 
                type="text" 
                value={formData.tagline}
                onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono"
                placeholder="Building for tomorrow..."
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#89AACC] ml-1 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Resume Link (Portfolio)
              </label>
              <input 
                type="text" 
                value={formData.resumeUrl}
                onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})}
                className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono"
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#89AACC] ml-1 flex items-center gap-2">
              <FileText className="w-3 h-3" /> Long Bio (About Section)
            </label>
            <textarea 
              rows={6}
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
              className="w-full bg-bg/50 border border-stroke rounded-2xl p-6 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono resize-none leading-relaxed"
              placeholder="Describe the journey..."
            />
          </div>

          <div className="pt-8 border-t border-stroke">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] font-bold text-text-primary mb-8 flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Stats & Numbers
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['stat1Value', 'stat2Value', 'stat3Value'].map((key, i) => (
                <div key={key} className="flex flex-col gap-3 group">
                   <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
                     {i === 0 ? "Years experience" : i === 1 ? "Projects completed" : "Core Technologies"}
                   </span>
                   <input 
                    type="text"
                    value={formData.stats[key]}
                    onChange={(e) => setFormData({
                      ...formData, 
                      stats: { ...formData.stats, [key]: e.target.value }
                    })}
                    className="bg-bg/40 border border-stroke group-hover:border-[#89AACC]/40 rounded-xl p-4 text-lg font-display italic text-text-primary focus:outline-none focus:border-[#89AACC] transition-all text-center"
                    placeholder={`e.g. ${i === 0 ? '5+' : i === 1 ? '40+' : 'React/Nextjs'}`}
                   />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end pt-10">
            <button 
              type="submit"
              disabled={saveStatus !== 'idle'}
              className={cn(
                "min-w-[180px] relative group overflow-hidden rounded-2xl px-10 py-5 transition-all active:scale-[0.98] disabled:opacity-80",
                saveStatus === 'saved' ? "bg-emerald-500 text-white" : "bg-text-primary text-bg"
              )}
            >
              <div className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                 {saveStatus === 'saving' && <Loader2 className="w-4 h-4 animate-spin text-bg" />}
                 {saveStatus === 'saved' && <Check className="w-4 h-4 text-white" />}
                 {saveStatus === 'idle' && <Save className="w-4 h-4 text-bg" />}
                 <span className={cn(
                   "text-xs font-bold uppercase tracking-widest",
                   saveStatus === 'saved' ? "text-white" : "text-bg"
                 )}>
                   {saveStatus === 'idle' ? "Save Profile" : saveStatus === 'saving' ? "Saving..." : "Profile Saved!"}
                 </span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
