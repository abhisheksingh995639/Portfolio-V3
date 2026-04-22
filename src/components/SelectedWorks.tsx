import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Github, ExternalLink } from "lucide-react";
import { cn } from "../lib/utils";
import type { PortfolioData } from "../App";
import { useLenis } from "@studio-freight/react-lenis";

export function SelectedWorks({ ui, projects }: { ui?: any; projects: NonNullable<PortfolioData["projects"]> }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const lenis = useLenis();

  // Disable global scroll when modal is open
    useEffect(() => {
    if (selectedProject) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [selectedProject, lenis]);

  // If we don't have exactly 4 projects from Firebase, we pad/trim to fit the design
  const displayProjects = projects.length > 0 
    ? projects.slice(0, showAll ? projects.length : 4) 
    : [
        { title: "Automotive Motion", img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80", desc: "A creative automotive visualization project.", tags: "React, GSAP", github: "#", link: "#" },
        { title: "Urban Architecture", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80", desc: "Modern architectural exploration.", tags: "Next.js, Tailwind", github: "#", link: "#" },
        { title: "Human Perspective", img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80", desc: "A study on human behavior and digital interaction.", tags: "P5.js, React", github: "#", link: "#" },
        { title: "Brand Identity", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80", desc: "Complete visual rebranding for a startup.", tags: "Design, Branding", github: "#", link: "#" },
      ];

  return (
    <section id="work" className="bg-bg py-12 md:py-16 relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">{ui?.label || "Selected Work"}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight">
              Featured <span className="font-display italic">projects</span>
            </h2>
            <p className="text-muted mt-4 max-w-sm">
              {ui?.subtitle || "A selection of projects I've worked on, from concept to launch."}
            </p>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {displayProjects.map((project, idx) => {
            // Alternating column spans: 7, 5, 5, 7
            const colSpan = idx % 4 === 0 || idx % 4 === 3 ? "md:col-span-7" : "md:col-span-5";
            const imageUrl = ('imageUrl' in project ? project.imageUrl : project.img) || `https://picsum.photos/seed/${project.title}/1200/800`;
            
            return (
              <div
                key={idx}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  "group relative bg-surface border border-stroke rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto md:min-h-[400px] cursor-pointer",
                  colSpan
                )}
              >
                <img
                  src={imageUrl}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${project.title}/1200/800` }}
                />
                
                {/* Halftone Overlay */}
                <div
                  className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                    backgroundSize: "4px 4px",
                  }}
                />

                {/* Hover States */}
                <div className="absolute inset-0 bg-bg/85 opacity-0 group-hover:opacity-100 backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#89AACC]">
                       Featured Project
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div 
                      onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                      className="relative p-[1px] rounded-full overflow-hidden cursor-pointer"
                    >
                      <div className="absolute inset-0 accent-gradient animate-gradient-shift blur-sm" />
                      <div className="relative bg-white text-bg px-8 py-3 rounded-full flex items-center gap-2 font-medium transition-transform active:scale-95">
                        View Details <span className="font-display italic text-lg leading-none">—</span> <span className="font-display italic font-normal text-lg">{project.title}</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More Button */}
        {!showAll && projects.length > 4 && (
          <div className="mt-16 flex justify-center">
            <button 
              onClick={() => setShowAll(true)}
              className="inline-flex group relative items-center justify-center rounded-full bg-surface text-text-primary px-6 py-1.5 border border-stroke hover:border-transparent transition-all overflow-hidden"
            >
               <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
               <div className="relative flex items-center gap-3 bg-surface rounded-full px-5 py-2.5 hover:bg-bg transition-colors h-full w-full">
                 <span className="text-sm font-bold uppercase tracking-wider">View more</span>
                 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
               </div>
            </button>
          </div>
        )}
      </div>

      {/* Project Detail Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-full md:w-[600px] h-full bg-surface border-l border-stroke z-[101] overflow-y-auto"
              data-lenis-prevent
            >
              <div className="p-8 md:p-12">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="mb-12 w-12 h-12 rounded-full border border-stroke flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-muted" />
                </button>

                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-12 border border-stroke">
                   <img 
                    src={selectedProject.imageUrl || selectedProject.img} 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover"
                   />
                </div>

                <div className="mb-12">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#89AACC] mb-4 block">
                    Product Focus
                  </span>
                  <div className="space-y-8">
                    <h2 className="text-5xl font-display italic text-text-primary underline decoration-[#89AACC] underline-offset-8 decoration-2">
                      {selectedProject.title}
                    </h2>
                    
                    <div className="flex flex-row gap-4">
                      {selectedProject.link && (
                        <a 
                         href={selectedProject.link} 
                         target="_blank" 
                         rel="noreferrer"
                         className="group relative inline-flex items-center justify-center rounded-2xl bg-text-primary text-bg px-4 py-5 overflow-hidden text-sm flex-1"
                        >
                           <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
                           <span className="relative z-10 font-bold flex items-center gap-2 group-hover:text-white transition-colors">
                             Live Site <ExternalLink className="w-4 h-4" />
                           </span>
                        </a>
                      )}
                      {selectedProject.github && (
                        <a 
                         href={selectedProject.github} 
                         target="_blank" 
                         rel="noreferrer"
                         className="group relative inline-flex items-center justify-center rounded-2xl bg-text-primary text-bg px-4 py-5 overflow-hidden text-sm flex-1"
                        >
                          <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="relative z-10 font-bold flex items-center gap-2 group-hover:text-white transition-colors">
                            GitHub <Github className="w-4 h-4" />
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>



                <div className="mb-12">
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-4">Description</p>
                  <p className="text-muted leading-relaxed text-lg italic">
                    {selectedProject.desc || "No description available for this project."}
                  </p>
                </div>

                <div className="mb-12">
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-4">Tech Used</p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProject.tags || "").split(",").map((tag: string) => (
                      <span key={tag} className="px-4 py-2 rounded-full bg-stroke/30 border border-stroke text-xs font-medium text-text-primary">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>


              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
