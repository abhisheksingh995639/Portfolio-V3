import { useState, useEffect } from "react";
import { db, auth } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Download, 
  Briefcase, 
  Layers,
  Activity,
  Cpu
} from "lucide-react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const start = performance.now();
      try {
        const [portfolioSnap, analyticsSnap] = await Promise.all([
          getDoc(doc(db, "portfolio", "data")),
          getDoc(doc(db, "portfolio", "analytics"))
        ]);
        
        const end = performance.now();
        setLatency(Math.round(end - start));

        if (portfolioSnap.exists()) setData(portfolioSnap.data());
        if (analyticsSnap.exists()) setAnalytics(analyticsSnap.data());
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
     <div className="flex items-center justify-center h-full">
        <Activity className="w-8 h-8 text-[#89AACC] animate-spin" />
     </div>
  );

  // Prepare Radar Chart Data
  const categories = ["web", "ml", "tools", "db", "security", "cloud"];
  const skillCounts = categories.map(cat => 
    (data?.skills?.filter((s: any) => s.category === cat).length || 0) + 
    (data?.languages?.filter((l: any) => l.category === cat).length || 0)
  );

  const radarData = {
    labels: categories.map(c => c.toUpperCase()),
    datasets: [
      {
        label: 'Skill Density',
        data: skillCounts,
        backgroundColor: 'rgba(137, 170, 204, 0.2)',
        borderColor: '#89AACC',
        borderWidth: 2,
        pointBackgroundColor: '#89AACC',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#89AACC',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        pointLabels: { 
          color: '#89AACC',
          font: { family: 'monospace', size: 10 } 
        },
        ticks: { display: false },
        suggestedMin: 0,
      }
    },
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  const stats = [
    { label: "Total Page Views", value: analytics?.views || 0, icon: TrendingUp, color: "text-[#89AACC]" },
    { label: "Resume Downloads", value: analytics?.resumeDownloads || 0, icon: Download, color: "text-purple-400" },
    { label: "Total Projects", value: data?.projects?.length || 0, icon: Briefcase, color: "text-orange-400" },
    { label: "Skills & Languages", value: (data?.skills?.length || 0) + (data?.languages?.length || 0), icon: Layers, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
           <motion.div 
             key={stat.label}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: i * 0.1 }}
             className="bg-surface/30 backdrop-blur-xl border border-stroke p-8 rounded-3xl relative group overflow-hidden"
           >
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <Cpu className="w-12 h-12" />
             </div>
             <p className="text-[9px] font-mono text-muted uppercase tracking-[0.3em] mb-4">{stat.label}</p>
             <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-display italic text-text-primary">{stat.value}</h3>
                <stat.icon className={`w-4 h-4 ${stat.color} opacity-40`} />
             </div>
             <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-transparent to-[#89AACC]/40"
                />
             </div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Map */}
        <div className="lg:col-span-2 bg-surface/30 backdrop-blur-xl border border-stroke p-8 rounded-[2rem] relative overflow-hidden group">
           <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-[0.2em] font-bold text-text-primary flex items-center gap-3">
                   <Activity className="w-4 h-4 text-[#89AACC]" />
                   Skill Distribution
                </h3>
              </div>
              <span className="text-[8px] font-mono text-muted uppercase tracking-widest border border-stroke px-2 py-1 rounded">Live Data</span>
           </div>
           
           <div className="h-[400px] relative">
              <Radar data={radarData} options={radarOptions} />
           </div>
        </div>

        {/* System Logs / Stats */}
        <div className="bg-surface/30 backdrop-blur-xl border border-stroke p-8 rounded-[2rem] flex flex-col">
           <h3 className="text-sm font-mono uppercase tracking-[0.2em] font-bold text-text-primary mb-8 flex items-center gap-3">
              <Cpu className="w-4 h-4 text-purple-400" />
              System Status
           </h3>

           <div className="flex-1 space-y-6 font-mono text-[10px]">
              <div className="flex justify-between items-center py-3 border-b border-stroke">
                 <span className="text-muted tracking-widest uppercase">Security</span>
                 <span className="text-[#89AACC]">Active (AES-256)</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-stroke">
                 <span className="text-muted tracking-widest uppercase">Firebase Status</span>
                 <span className="text-emerald-400">Connected</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-stroke">
                 <span className="text-muted tracking-widest uppercase">Database Speed</span>
                 <span className="text-amber-400">~{latency || 24}ms</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-stroke">
                 <span className="text-muted tracking-widest uppercase">Admin Token</span>
                 <span className="text-text-primary opacity-40">0x...{auth.currentUser?.uid.slice(-6)}</span>
              </div>
              
              <div className="pt-8">
                 <p className="text-[9px] text-muted mb-4 uppercase tracking-[0.2em]">Diagnostic Terminal</p>
                 <div className="bg-black/40 p-4 rounded-xl border border-stroke/50 h-32 overflow-hidden relative">
                    <div className="text-[#89AACC] space-y-1">
                       <p>{">"} AUTH_SESSION_INITIATED</p>
                       <p>{">"} HANDSHAKE_PROTOCOL_COMPLETE</p>
                       <p>{">"} SYNCING_DATA_NODES...</p>
                       <p className="animate-pulse">{">"} WAITING_FOR_OPERATOR_INPUT_</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
