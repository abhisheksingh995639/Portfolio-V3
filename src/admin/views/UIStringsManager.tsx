import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, 
  Terminal, 
  Layout, 
  MessageSquare, 
  Zap, 
  RefreshCcw,
  Plus,
  X,
  ShieldAlert,
  Check,
  Loader2
} from "lucide-react";
import { cn } from "../../lib/utils";

const DEFAULTS = {
  hero: {
    roles: ["Developer", "AI Engineer", "Creator", "Scholar"],
    collectionYear: "COLLECTION '26",
    scrollText: "SCROLL",
    seeWorksBtn: "See Works",
    reachOutBtn: "Reach out...",
    sayHiBtn: "Say hi"
  },
  footer: {
    marquee: [
      "BUILDING THE FUTURE",
      "CRAFTING DIGITAL EXPERIENCES",
      "ENGINEERING WITH PASSION",
      "DESIGNING FOR TOMORROW",
      "PUSHING THE BOUNDARIES"
    ],
    contactTitle: "Let's build tomorrow.",
    contactDesc: "Send an inquiry and I'll get back to you shortly.",
    availabilityText: "Available for projects"
  },
  loading: {
    words: ["Design", "Create", "Inspire"],
    label: "Portfolio"
  },
  sections: {
    about: { label: "About Me", tagline: "Driven by Curiosity" },
    works: { label: "Selected Works", subtitle: "A selection of projects that define my craft." },
    journal: { label: "Journal", subtitle: "Notes on progress and systems architectural design." }
  }
};

export function UIStringsManager() {
  const [uiData, setUiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState("hero");
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [cleanupStatus, setCleanupStatus] = useState<'idle' | 'cleaning' | 'done'>('idle');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const snap = await getDoc(doc(db, "portfolio", "data"));
    if (snap.exists()) {
      setUiData(snap.data().ui || DEFAULTS);
    }
    setLoading(false);
  }

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await updateDoc(doc(db, "portfolio", "data"), { ui: uiData });
      setSaveStatus('saved');
    } catch (err) {
      console.error("Sync failed:", err);
      setSaveStatus('idle');
    } finally {
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleReset = () => {
    if (confirm("Reset UI strings to system defaults?")) {
      setUiData(DEFAULTS);
    }
  };

  const handleCleanup = async () => {
    if (!confirm("This will permanently purge legacy data fields (expertise, unused stats, etc.). Proceed?")) return;
    
    setCleanupStatus('cleaning');
    try {
      const snap = await getDoc(doc(db, "portfolio", "data"));
      if (!snap.exists()) return;
      
      const data = snap.data();
      const updates: any = {};
      
      // 1. Clean identity stats
      if (data.general?.stats) {
        const { stat4Value, ...cleanStats } = data.general.stats;
        updates["general.stats"] = cleanStats;
      }
      
      // 2. Remove legacy expertise
      if (data.general?.expertise !== undefined) {
        updates["general.expertise"] = deleteField();
      }
      
      // 3. Clean projects
      if (data.projects) {
        updates.projects = data.projects.map((p: any) => {
          const { img, ...cleanP } = p;
          return cleanP;
        });
      }

      await updateDoc(doc(db, "portfolio", "data"), updates);
      setCleanupStatus('done');
    } catch (err) {
      console.error("Cleanup failed:", err);
      setCleanupStatus('idle');
    } finally {
      setTimeout(() => setCleanupStatus('idle'), 3000);
    }
  };

  const updateItem = (path: string, value: any) => {
    const keys = path.split(".");
    const newData = { ...uiData };
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
       current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setUiData(newData);
  };

  if (loading) return null;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center bg-surface/30 backdrop-blur-xl border border-stroke p-8 rounded-[2rem]">
         <div>
            <h2 className="text-xl font-display italic text-text-primary">Site Text Management</h2>
            <p className="text-[10px] font-mono text-muted uppercase tracking-[0.3em] mt-1">Manage all text shown on your site</p>
         </div>
         <div className="flex gap-4">
            <button 
              onClick={handleCleanup}
              disabled={cleanupStatus !== 'idle'}
              className={cn(
                "px-6 py-3 rounded-xl border transition-all flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest",
                cleanupStatus === 'done' ? "border-emerald-500 text-emerald-400" : "border-red-500/30 text-red-400 hover:bg-red-500/10"
              )}
            >
               {cleanupStatus === 'cleaning' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : cleanupStatus === 'done' ? <Check className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
               {cleanupStatus === 'idle' ? "Database Cleanup" : cleanupStatus === 'cleaning' ? "Cleaning..." : "System Purged"}
            </button>
            <button 
              onClick={handleReset}
              className="px-6 py-3 rounded-xl border border-stroke hover:bg-white/5 transition-all flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted"
            >
               <RefreshCcw className="w-3.5 h-3.5" /> Reset to Defaults
            </button>
            <button 
              onClick={handleSave}
              disabled={saveStatus !== 'idle'}
              className={cn(
                "min-w-[160px] px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg",
                saveStatus === 'saved' ? "bg-emerald-500 text-white" : "bg-text-primary text-bg hover:accent-gradient"
              )}
            >
               {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : saveStatus === 'saved' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
               {saveStatus === 'idle' ? "Save Changes" : saveStatus === 'saving' ? "Saving..." : "Changes Saved!"}
            </button>
         </div>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
         {[
            { id: "hero", label: "Hero (Top Section)", icon: Layout },
            { id: "footer", label: "Footer & Marquee", icon: Zap },
            { id: "contact", label: "Contact Section", icon: MessageSquare },
            { id: "system", label: "Loading Screen & Labels", icon: Terminal }
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveSubTab(tab.id)}
             className={`px-6 py-3 rounded-full text-[10px] font-mono uppercase tracking-widest border transition-all flex items-center gap-3 whitespace-nowrap ${
               activeSubTab === tab.id 
               ? "bg-[#89AACC]/10 border-[#89AACC] text-text-primary shadow-[0_0_15px_rgba(137,170,204,0.2)]" 
               : "border-stroke text-muted hover:border-text-primary/20"
             }`}
           >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
         <motion.div
           key={activeSubTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           className="bg-surface/30 backdrop-blur-xl border border-stroke p-10 rounded-[2rem] space-y-10"
         >
            {/* HERO SECTION */}
            {activeSubTab === "hero" && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <UIField label="Job Titles (Rotating list)" value={uiData.hero.roles.join(", ")} onChange={(v) => updateItem("hero.roles", v.split(",").map((s: string) => s.trim()))} />
                     <UIField label="Year Label" value={uiData.hero.collectionYear} onChange={(v) => updateItem("hero.collectionYear", v)} />
                     <UIField label="Location Text" value={uiData.hero.livesInText} onChange={(v) => updateItem("hero.livesInText", v)} />
                  </div>
                  <div className="space-y-6">
                     <UIField label="Button Label (Projects)" value={uiData.hero.seeWorksBtn} onChange={(v) => updateItem("hero.seeWorksBtn", v)} />
                     <UIField label="Button Label (Contact)" value={uiData.hero.reachOutBtn} onChange={(v) => updateItem("hero.reachOutBtn", v)} />
                     <UIField label="Menu Label (Say hi)" value={uiData.hero.sayHiBtn} onChange={(v) => updateItem("hero.sayHiBtn", v)} />
                  </div>
               </div>
            )}

            {/* GLOBAL FLOW (MARQUEE) */}
            {activeSubTab === "footer" && (
               <div className="space-y-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-mono text-[#89AACC] uppercase tracking-widest">Scrolling Background Text</label>
                     <div className="space-y-2">
                        {uiData.footer.marquee.map((phrase: string, idx: number) => (
                           <div key={idx} className="flex gap-2">
                              <input 
                                value={phrase}
                                onChange={(e) => {
                                   const newMarquee = [...uiData.footer.marquee];
                                   newMarquee[idx] = e.target.value;
                                   updateItem("footer.marquee", newMarquee);
                                }}
                                className="flex-1 bg-bg/50 border border-stroke rounded-xl px-5 py-3 text-sm font-mono text-text-primary focus:outline-none focus:border-[#89AACC]"
                              />
                              <button 
                                onClick={() => {
                                   const newMarquee = uiData.footer.marquee.filter((_: any, i: number) => i !== idx);
                                   updateItem("footer.marquee", newMarquee);
                                }}
                                className="w-11 h-11 flex items-center justify-center text-muted hover:text-red-400"
                              >
                                 <X className="w-4 h-4" />
                              </button>
                           </div>
                        ))}
                        <button 
                          onClick={() => updateItem("footer.marquee", [...uiData.footer.marquee, "NEW PROTOCOL"])}
                          className="w-full py-3 rounded-xl border border-dashed border-stroke text-muted hover:text-text-primary hover:border-text-primary/30 transition-all text-[10px] font-mono uppercase tracking-widest mt-4"
                        >
                           <Plus className="w-3 h-3 inline-block mr-2" /> Add New Phrase
                        </button>
                     </div>
                  </div>
                  <UIField label="Availability Text" value={uiData.footer.availabilityText} onChange={(v) => updateItem("footer.availabilityText", v)} />
               </div>
            )}

            {/* CONTACT PROTOCOL */}
            {activeSubTab === "contact" && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <UIField label="Contact Header" value={uiData.footer.contactTitle} onChange={(v) => updateItem("footer.contactTitle", v)} />
                  <UIField label="Contact Description" value={uiData.footer.contactDesc} onChange={(v) => updateItem("footer.contactDesc", v)} />
               </div>
            )}

            {/* SYSTEM DIAGNOSTIC */}
            {activeSubTab === "system" && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <UIField label="Loading Words" value={uiData.loading.words.join(", ")} onChange={(v) => updateItem("loading.words", v.split(",").map((s: string) => s.trim()))} />
                     <UIField label="System Status Label" value={uiData.loading.label} onChange={(v) => updateItem("loading.label", v)} />
                  </div>
                  <div className="space-y-6">
                     <UIField label="About Section Title" value={uiData.sections.about.label} onChange={(v) => updateItem("sections.about.label", v)} />
                     <UIField label="Projects Section Title" value={uiData.sections.works.label} onChange={(v) => updateItem("sections.works.label", v)} />
                     <UIField label="Journal Section Title" value={uiData.sections.journal.label} onChange={(v) => updateItem("sections.journal.label", v)} />
                  </div>
               </div>
            )}
         </motion.div>
      </AnimatePresence>
    </div>
  );
}

function UIField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
   return (
      <div className="space-y-3">
         <label className="text-[10px] font-mono text-[#89AACC] uppercase tracking-[0.2em]">{label}</label>
         <input 
           type="text" 
           value={value}
           onChange={(e) => onChange(e.target.value)}
           className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm font-mono text-text-primary focus:outline-none focus:border-[#89AACC] transition-all"
         />
      </div>
   );
}
