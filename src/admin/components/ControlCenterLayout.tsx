import { useState } from "react";
import { User, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { 
  LayoutDashboard, 
  Settings2, 
  LayoutGrid, 
  History, 
  Zap, 
  LogOut, 
  ChevronRight,
  Database,
  Search,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminDashboard } from "../views/AdminDashboard";
import { IdentityEditor } from "../views/IdentityEditor";
import { AssetsManager } from "../views/AssetsManager";
import { JourneyManager } from "../views/JourneyManager";
import { StackManager } from "../views/StackManager";
import { UIStringsManager } from "../views/UIStringsManager";

interface LayoutProps {
  user: User;
}

export function ControlCenterLayout({ user }: LayoutProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "identity", label: "Profile & Bio", icon: Settings2 },
    { id: "assets", label: "Projects Grid", icon: LayoutGrid },
    { id: "journey", label: "Work Experience", icon: History },
    { id: "matrix", label: "Skills & Stack", icon: Zap },
    { id: "ui", label: "Site Content", icon: Database },
  ];

  const handleLogout = () => signOut(auth);

  return (
    <div className="h-screen w-screen bg-bg text-text-primary flex overflow-hidden font-sans relative">
      {/* HUD Scanline & Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Sidebar */}
      <aside className="w-72 bg-surface/20 border-r border-stroke flex flex-col relative z-20 backdrop-blur-3xl">
        <div className="p-8 border-b border-stroke">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-text-primary rounded-xl flex items-center justify-center text-bg font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                AS
             </div>
             <div>
                <h1 className="text-lg font-display italic tracking-tight leading-none">Console</h1>
                <span className="text-[8px] font-mono tracking-widest text-[#89AACC] uppercase opacity-60">Version 3.0.0</span>
             </div>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-focus-within:text-[#89AACC] transition-colors" />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full bg-bg/40 border border-stroke rounded-lg py-2 pl-9 pr-4 text-[11px] focus:outline-none focus:border-[#89AACC] transition-all font-mono"
            />
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted mb-4 ml-2">Main Controls</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between group px-4 py-3.5 rounded-xl transition-all relative ${
                activeTab === item.id 
                ? "bg-[#89AACC]/10 text-text-primary" 
                : "text-muted hover:text-text-primary hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-[#89AACC]" : "text-muted group-hover:text-text-primary"}`} />
                <span className="text-[11px] font-mono uppercase tracking-widest">{item.label}</span>
              </div>
              {activeTab === item.id && (
                <motion.div layoutId="nav-pill" className="absolute left-0 w-1 h-1/2 bg-[#89AACC] rounded-r-full" />
              )}
              <ChevronRight className={`w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity ${activeTab === item.id ? "opacity-40" : ""}`} />
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-stroke bg-black/20">
          <div className="p-4 bg-surface/40 rounded-2xl border border-stroke flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-surface-lighter flex items-center justify-center border border-stroke overflow-hidden">
               {/* User Avatar Placeholder */}
               <div className="w-full h-full bg-gradient-to-br from-[#89AACC] to-[#4E85BF] opacity-80" />
            </div>
            <div className="overflow-hidden">
               <p className="text-[10px] font-bold truncate">{user.email}</p>
               <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] font-mono text-muted uppercase tracking-widest">Logged In</span>
               </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-bg/50 border border-stroke hover:border-red-500/50 hover:bg-red-500/10 text-muted hover:text-red-400 py-3 rounded-xl text-[10px] font-mono uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-bg relative overflow-hidden">
         {/* Background Grid */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#89AACC 1px, transparent 1px), linear-gradient(90deg, #89AACC 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

         {/* Header Bar */}
         <header className="h-20 border-b border-stroke flex items-center justify-between px-10 relative z-10 backdrop-blur-md bg-bg/40">
            <div className="flex items-center gap-4">
               <div className="p-2.5 bg-surface-lighter rounded-xl border border-stroke">
                  <Database className="w-4 h-4 text-[#89AACC]" />
               </div>
               <div>
                  <h2 className="text-sm font-mono uppercase tracking-[0.3em] font-bold">
                    {navItems.find(i => i.id === activeTab)?.label || "Console"}
                  </h2>
                  <p className="text-[8px] font-mono text-muted uppercase tracking-widest mt-1">Status: Ready</p>
               </div>
            </div>

            <div className="flex items-center gap-6">
               <a 
                 href="/" 
                 target="_blank" 
                 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#89AACC] hover:text-text-primary transition-colors flex items-center gap-2 group"
               >
                 <Maximize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                 View Site
               </a>
            </div>
         </header>

         {/* Content View */}
         <div className="flex-1 overflow-y-auto p-10 relative z-10 custom-scrollbar">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="h-full"
             >
               {activeTab === "dashboard" && <AdminDashboard />}
               {activeTab === "identity" && <IdentityEditor />}
               {activeTab === "assets" && <AssetsManager />}
               {activeTab === "journey" && <JourneyManager />}
               {activeTab === "matrix" && <StackManager />}
               {activeTab === "ui" && <UIStringsManager />}
             </motion.div>
           </AnimatePresence>
         </div>
      </main>
    </div>
  );
}
