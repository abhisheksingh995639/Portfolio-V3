import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Github, 
  Image as ImageIcon,
  X,
  Layers,
  Search,
  Globe,
  Check,
  Loader2
} from "lucide-react";

export function AssetsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    imageUrl: "",
    github: "",
    link: "",
    tags: "",
    category: "web"
  });

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const snap = await getDoc(doc(db, "portfolio", "data"));
    if (snap.exists()) {
      setProjects(snap.data().projects || []);
    }
    setLoading(false);
  }

  const openModal = (index: number | null = null) => {
    setSaveStatus('idle');
    if (index !== null) {
      setEditingIndex(index);
      const project = projects[index];
      setFormData({
        title: project.title || "",
        desc: project.desc || "",
        imageUrl: project.imageUrl || project.img || "",
        github: project.github || "",
        link: project.link || "",
        tags: project.tags || "",
        category: project.category || "web"
      });
    } else {
      setEditingIndex(null);
      setFormData({
        title: "",
        desc: "",
        imageUrl: "",
        github: "",
        link: "",
        tags: "",
        category: "web"
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedProjects = [...projects];

    const cleanedData = {
      title: formData.title,
      desc: formData.desc,
      imageUrl: formData.imageUrl,
      github: formData.github,
      link: formData.link,
      tags: formData.tags,
      category: formData.category
    };

    if (editingIndex !== null) {
      updatedProjects[editingIndex] = cleanedData;
    } else {
      updatedProjects.push(cleanedData);
    }

    // Length check for large payloads (e.g. Base64) to prevent Firestore 1MB doc limit crash
    const payloadSize = JSON.stringify(updatedProjects).length;
    if (payloadSize > 850000) { // ~850KB safety threshold
      setSaveStatus('error');
      setErrorMessage("The image data is too large for the database. Please use a smaller file or a direct link.");
      setTimeout(() => setSaveStatus('idle'), 4000);
      return;
    }

    setSaveStatus('saving');
    try {
      await updateDoc(doc(db, "portfolio", "data"), { projects: updatedProjects });
      setProjects(updatedProjects);
      setSaveStatus('saved');
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveStatus('idle');
      }, 1500);
    } catch (err: any) {
      console.error("Save failed:", err);
      setSaveStatus('error');
      setErrorMessage(err.message || "Failed to sync with cloud. Check console for details.");
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Are you sure you want to purge this asset?")) return;
    const updatedProjects = projects.filter((_, i) => i !== index);
    setSaveStatus('saving');
    try {
      await updateDoc(doc(db, "portfolio", "data"), { projects: updatedProjects });
      setProjects(updatedProjects);
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 1500);
    } catch (err) {
      console.error("Delete failed:", err);
      setSaveStatus('idle');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return null;

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-surface/30 backdrop-blur-xl border border-stroke p-8 rounded-[2rem]">
         <div>
            <h2 className="text-xl font-display italic text-text-primary">Project List</h2>
            <p className="text-[10px] font-mono text-muted uppercase tracking-[0.3em] mt-1">Manage all your projects</p>
         </div>
         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Filter assets..."
                 className="w-full bg-bg/40 border border-stroke rounded-xl py-3 pl-10 pr-4 text-[11px] focus:outline-none focus:border-[#89AACC] transition-all font-mono"
               />
            </div>
            <button 
              onClick={() => openModal()}
              className="bg-text-primary text-bg px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:accent-gradient transition-all active:scale-95 shadow-lg shadow-white/5"
            >
               <Plus className="w-4 h-4" /> New Project
            </button>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {filteredProjects.map((project, i) => (
           <motion.div 
             key={i}
             layoutId={`project-${i}`}
             className="bg-surface/30 backdrop-blur-xl border border-stroke rounded-3xl overflow-hidden group hover:border-[#89AACC]/40 transition-all"
           >
             <div className="h-48 relative overflow-hidden bg-bg">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  onError={(e: any) => e.target.src = "https://picsum.photos/seed/bg/800/400"}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                   <div className="bg-bg/80 backdrop-blur-md border border-stroke px-3 py-1 rounded-full flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#89AACC]" />
                      <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#89AACC]">{project.category}</span>
                   </div>
                </div>
             </div>
             <div className="p-6">
                <h3 className="text-lg font-display italic text-text-primary mb-2">{project.title}</h3>
                <p className="text-xs text-muted line-clamp-2 mb-6 font-mono leading-relaxed">{project.desc}</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-stroke">
                   <div className="flex gap-2">
                      <button 
                        onClick={() => openModal(i)}
                        className="w-9 h-9 rounded-xl bg-bg/50 border border-stroke flex items-center justify-center text-muted hover:text-[#89AACC] hover:border-[#89AACC]/40 transition-all"
                      >
                         <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(i)}
                        className="w-9 h-9 rounded-xl bg-bg/50 border border-stroke flex items-center justify-center text-muted hover:text-red-400 hover:border-red-400/40 transition-all"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                   <div className="flex gap-3 text-muted">
                      {project.github && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-text-primary transition-colors p-1"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-[#89AACC] transition-colors p-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                   </div>
                </div>
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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-surface border border-stroke w-full max-w-4xl rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
              >
                 <div className="p-10 border-b border-stroke flex items-center justify-between shrink-0">
                    <div>
                       <h2 className="text-2xl font-display italic text-text-primary capitalize">{editingIndex !== null ? "Edit Project" : "Add Project"}</h2>
                       <p className="text-[10px] font-mono text-muted uppercase tracking-[0.3em] mt-1">Status: Editing</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                       <X className="w-5 h-5 text-muted" />
                    </button>
                 </div>

                 <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                    {/* Core Identity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC]">Project Title</label>
                          <input 
                            required
                            type="text" 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono"
                            placeholder="e.g. Nexus Controller"
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC]">Tools & Technologies</label>
                          <input 
                            type="text" 
                            value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                            className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono"
                            placeholder="React, GSAP, Tailwind..."
                          />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC]">Project Description</label>
                       <textarea 
                         required
                         rows={3}
                         value={formData.desc}
                         onChange={(e) => setFormData({...formData, desc: e.target.value})}
                         className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono resize-none"
                         placeholder="Asset overview..."
                       />
                    </div>

                    {/* Media & Links */}
                    <div className="pt-10 border-t border-stroke grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="md:col-span-3 space-y-4">
                          <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC] flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Project Image URL</label>
                          <input 
                             type="text" 
                             value={formData.imageUrl}
                             onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                             className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono"
                             placeholder="https://..."
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC] flex items-center gap-2"><Github className="w-3 h-3" /> GitHub Repository</label>
                          <input 
                            type="text" 
                            value={formData.github}
                            onChange={(e) => setFormData({...formData, github: e.target.value})}
                            className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono text-center"
                            placeholder="https://..."
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC] flex items-center gap-2"><Globe className="w-3 h-3" /> Live Demo Link</label>
                          <input 
                            type="text" 
                            value={formData.link}
                            onChange={(e) => setFormData({...formData, link: e.target.value})}
                            className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono text-center"
                            placeholder="https://..."
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC] flex items-center gap-2"><Layers className="w-3 h-3" /> Category</label>
                          <select 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full bg-bg/50 border border-stroke rounded-2xl p-5 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono appearance-none text-center"
                          >
                             <option value="web">Web Development</option>
                             <option value="ml">AI & Machine Learning</option>
                             <option value="tools">Tools & Utilities</option>
                             <option value="ds">Data Science</option>
                             <option value="security">Cyber Security</option>
                          </select>
                       </div>
                    </div>


                    
                    <div className="flex flex-col gap-4 pt-10 border-t border-stroke">
                      <div className="flex justify-end gap-4">
                         <button 
                           type="button" 
                           onClick={() => setIsModalOpen(false)}
                           className="px-8 py-5 rounded-2xl text-xs font-bold uppercase tracking-widest text-muted hover:text-text-primary hover:bg-white/5 transition-all"
                         >
                            Discard
                         </button>
                         <button 
                           type="submit"
                           disabled={saveStatus === 'saving'}
                           className={cn(
                             "min-w-[180px] px-12 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-white/10",
                             saveStatus === 'saved' ? "bg-emerald-500 text-white" : 
                             saveStatus === 'error' ? "bg-red-500 text-white" : 
                             "bg-text-primary text-bg hover:accent-gradient"
                           )}
                         >
                            {saveStatus === 'saving' && <Loader2 className="w-5 h-5 animate-spin" />}
                            {saveStatus === 'saved' && <Check className="w-5 h-5 text-white" />}
                            {saveStatus === 'error' && <X className="w-5 h-5 text-white" />}
                            {saveStatus === 'idle' ? "Save Project" : 
                             saveStatus === 'saving' ? "Saving..." : 
                             saveStatus === 'error' ? "Sync Error" : "Project Saved!"}
                         </button>
                      </div>
                      {saveStatus === 'error' && (
                        <p className="text-right text-red-500 text-[10px] font-mono uppercase tracking-widest animate-pulse">
                          {errorMessage}
                        </p>
                      )}
                    </div>
                 </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}
