import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Zap, 
  Globe, 
  X,
  Check,
  Loader2
} from "lucide-react";
import { cn } from "../../lib/utils";

export function StackManager() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({ name: "", category: "web" });
  const [newLang, setNewLang] = useState({ name: "", level: "B2" });
  const [skillStatus, setSkillStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [langStatus, setLangStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const snap = await getDoc(doc(db, "portfolio", "data"));
    if (snap.exists()) setData(snap.data());
    setLoading(false);
  }

  const handleAddSkill = async () => {
    if (!newSkill.name) return;
    setSkillStatus('saving');
    const updated = [...(data?.skills || []), newSkill];
    try {
      await updateDoc(doc(db, "portfolio", "data"), { skills: updated });
      setData({ ...data, skills: updated });
      setSkillStatus('saved');
      setNewSkill({ name: "", category: "web" });
    } catch (err) {
      console.error("Add skill failed:", err);
      setSkillStatus('idle');
    } finally {
      setTimeout(() => setSkillStatus('idle'), 2000);
    }
  };

  const handleAddLang = async () => {
    if (!newLang.name) return;
    setLangStatus('saving');
    const levelMap: any = { 'A1': 20, 'A2': 40, 'B1': 60, 'B2': 80, 'C1': 90, 'C2': 100 };
    const langData = { ...newLang, pct: levelMap[newLang.level] };
    const updated = [...(data?.languages || []), langData];
    try {
      await updateDoc(doc(db, "portfolio", "data"), { languages: updated });
      setData({ ...data, languages: updated });
      setLangStatus('saved');
      setNewLang({ name: "", level: "B2" });
    } catch (err) {
      console.error("Add language failed:", err);
      setLangStatus('idle');
    } finally {
      setTimeout(() => setLangStatus('idle'), 2000);
    }
  };

  const handleDelete = async (type: "skills" | "languages", index: number) => {
    const updated = data[type].filter((_: any, i: number) => i !== index);
    await updateDoc(doc(db, "portfolio", "data"), { [type]: updated });
    setData({ ...data, [type]: updated });
  };

  if (loading) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-20">
      {/* Tech Stack Modules */}
      <div className="space-y-8">
        <div className="bg-surface/30 backdrop-blur-xl border border-stroke p-8 rounded-[2rem]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#89AACC]/10 rounded-2xl border border-[#89AACC]/20">
              <Zap className="w-5 h-5 text-[#89AACC]" />
            </div>
            <div>
              <h2 className="text-xl font-display italic text-text-primary">Skills & Stack</h2>
              <p className="text-[10px] font-mono text-muted uppercase tracking-[0.3em] mt-1">Manage all your technical skills</p>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
             <input 
               type="text" 
               placeholder="Skill name (e.g. React)"
               value={newSkill.name}
               onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
               className="flex-1 bg-bg/40 border border-stroke rounded-xl px-4 py-3 text-[11px] font-mono focus:outline-none focus:border-[#89AACC] transition-all"
             />
             <select 
               value={newSkill.category}
               onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
               className="bg-bg/40 border border-stroke rounded-xl px-4 py-3 text-[11px] font-mono focus:outline-none focus:border-[#89AACC] transition-all appearance-none text-[#89AACC]"
             >
                <option value="web">Web</option>
                <option value="ml">AI & ML</option>
                <option value="tools">Utilities</option>
                <option value="db">Databases</option>
                <option value="cloud">Cloud & Infra</option>
             </select>
             <button 
               onClick={handleAddSkill}
               disabled={skillStatus !== 'idle'}
               className={cn(
                 "w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg",
                 skillStatus === 'saved' ? "bg-emerald-500 text-white" : "bg-text-primary text-bg hover:accent-gradient"
               )}
             >
                {skillStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : skillStatus === 'saved' ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
             </button>
          </div>

          <div className="flex flex-wrap gap-2">
             {data?.skills?.map((skill: any, i: number) => (
               <motion.div 
                 key={i}
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg/40 border border-stroke group hover:border-[#89AACC]/40 transition-all font-mono"
               >
                  <div className={`w-1 h-1 rounded-full ${
                    skill.category === 'web' ? 'bg-[#89AACC]' : 
                    skill.category === 'ml' ? 'bg-purple-400' : 'bg-emerald-400'
                  }`} />
                  <span className="text-[10px] uppercase tracking-widest text-text-primary/70">{skill.name}</span>
                  <button 
                    onClick={() => handleDelete("skills", i)}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-all text-muted hover:text-red-400"
                  >
                     <X className="w-2.5 h-2.5" />
                  </button>
               </motion.div>
             ))}
          </div>
        </div>
      </div>

      {/* Language Proficiency */}
      <div className="space-y-8">
        <div className="bg-surface/30 backdrop-blur-xl border border-stroke p-8 rounded-[2rem]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
              <Globe className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-display italic text-text-primary">Languages</h2>
              <p className="text-[10px] font-mono text-muted uppercase tracking-[0.3em] mt-1">Language proficiency levels</p>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
             <input 
               type="text" 
               placeholder="Language name (e.g. English)"
               value={newLang.name}
               onChange={(e) => setNewLang({...newLang, name: e.target.value})}
               className="flex-1 bg-bg/40 border border-stroke rounded-xl px-4 py-3 text-[11px] font-mono focus:outline-none focus:border-[#89AACC] transition-all"
             />
             <select 
               value={newLang.level}
               onChange={(e) => setNewLang({...newLang, level: e.target.value})}
               className="bg-bg/40 border border-stroke rounded-xl px-4 py-3 text-[11px] font-mono focus:outline-none focus:border-[#89AACC] transition-all appearance-none text-[#89AACC]"
             >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
             </select>
             <button 
               onClick={handleAddLang}
               disabled={langStatus !== 'idle'}
               className={cn(
                 "w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg",
                 langStatus === 'saved' ? "bg-emerald-500 text-white" : "bg-text-primary text-bg hover:accent-gradient"
               )}
             >
                {langStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : langStatus === 'saved' ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
             </button>
          </div>

          <div className="space-y-4">
             {data?.languages?.map((lang: any, i: number) => (
               <div key={i} className="flex flex-col gap-2 group">
                  <div className="flex justify-between items-center px-1">
                     <span className="text-[10px] font-mono uppercase tracking-widest text-[#89AACC]">{lang.name} <span className="text-muted ml-2">[{lang.level}]</span></span>
                     <button 
                       onClick={() => handleDelete("languages", i)}
                       className="opacity-0 group-hover:opacity-100 transition-all text-red-400"
                     >
                        <Trash2 className="w-3 h-3" />
                     </button>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${lang.pct}%` }}
                       className="h-full bg-gradient-to-r from-transparent via-[#89AACC] to-text-primary"
                     />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
