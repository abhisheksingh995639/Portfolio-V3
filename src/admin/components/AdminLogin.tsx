import { useState } from "react";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import { ShieldAlert, Terminal } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || "Authorization failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* HUD Background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 border-l border-t border-stroke w-32 h-32" />
        <div className="absolute bottom-10 right-10 border-r border-b border-stroke w-32 h-32" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-stroke rounded-full opacity-20" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-surface/40 backdrop-blur-2xl border border-stroke rounded-3xl p-10 relative overflow-hidden shadow-2xl">
          {/* Internal HUD elements */}
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <span className="text-[8px] font-mono tracking-widest text-[#89AACC]">SEC_LEVEL: ALPHA</span>
          </div>
          
          <div className="mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#89AACC]/10 border border-[#89AACC]/30 flex items-center justify-center mx-auto mb-6 relative group">
              <div className="absolute inset-0 bg-[#89AACC]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <ShieldAlert className="w-8 h-8 text-[#89AACC] relative z-10" />
            </div>
            <h1 className="text-3xl font-display italic text-text-primary tracking-tight">System Access</h1>
            <p className="text-[10px] text-muted uppercase tracking-[0.4em] mt-3 font-mono">Authentication Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC] ml-1">Identifer</label>
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@abhisheksingh.tech"
                  className="w-full bg-bg/50 border border-stroke rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#89AACC] ml-1">Digital Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-bg/50 border border-stroke rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#89AACC] transition-all font-mono"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3"
              >
                <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[10px] uppercase font-mono text-red-400 tracking-wider font-bold">{error}</p>
              </motion.div>
            )}

            <button 
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-xl bg-text-primary py-4 transition-all active:scale-[0.98]"
            >
              <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                 <Terminal className="w-4 h-4 text-bg" />
                 <span className="text-sm font-bold uppercase tracking-widest text-bg">
                   {loading ? "Decrypting..." : "Authorize Session"}
                 </span>
              </div>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-stroke text-center">
            <p className="text-[8px] font-mono text-muted uppercase tracking-[0.2em]">© 2024 Command.Center v3.0.1</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
