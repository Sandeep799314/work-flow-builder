import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, Database, Zap, Layout, PlayCircle } from "lucide-react";
import Card from "../components/ui/Card"; 
import API from "../services/api";

// --- Animations Settings ---
const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const cardHover = {
  rest: { scale: 1, boxShadow: "0px 0px 0px rgba(99, 102, 241, 0)" },
  hover: { 
    scale: 1.03, 
    boxShadow: "0px 10px 30px rgba(99, 102, 241, 0.2)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  }
};

export default function Dashboard() {
  const [workflowCount, setWorkflowCount] = useState(0);
  const [runCount, setRunCount] = useState(0);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [w, r, s] = await Promise.all([
          API.get("/workflows"),
          API.get("/runs"),
          API.get("/status")
        ]);
        setWorkflowCount(w.data.length);
        setRunCount(r.data.length);
        setStatus(s.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-slate-200 p-8 overflow-hidden font-sans">
      
      {/* --- Background Animated Blobs (Eye Candy) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, 100, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" 
        />
      </div>

      {/* --- Header --- */}
      <motion.header {...fadeInDown} className="relative z-10 mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Control Center
          </h1>
          <p className="text-slate-500 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            Neural Network status: Optimal
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Global Latency</p>
          <p className="text-2xl font-bold">14ms</p>
        </div>
      </motion.header>

      {/* --- Stats Grid --- */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        <StatCard 
          icon={<Layout className="text-indigo-400" />} 
          title="Total Workflows" 
          value={workflowCount} 
          color="from-indigo-500/20 to-transparent" 
        />
        
        <StatCard 
          icon={<PlayCircle className="text-purple-400" />} 
          title="Total Runs" 
          value={runCount} 
          color="from-purple-500/20 to-transparent" 
        />

        <motion.div variants={cardHover} initial="rest" whileHover="hover">
          <Card className="h-full bg-white/[0.03] border-white/10 backdrop-blur-md p-6">
            <h3 className="text-slate-400 text-sm font-medium flex items-center gap-2 mb-4">
              <Activity size={18} className="text-emerald-400" /> System Health
            </h3>
            <div className="space-y-3">
              {['Backend', 'Database', 'LLM'].map((node, i) => (
                <div key={node} className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{node}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '100%' }} 
                        transition={{ delay: i * 0.2 }}
                        className="h-full bg-emerald-500" 
                      />
                    </div>
                    <span className="text-emerald-400 font-bold text-[10px]">99%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* --- Detailed View --- */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Activity Feed */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-b from-white/[0.05] to-transparent border-white/10 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Zap size={20} className="text-yellow-400" /> Live Activity
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ x: 10 }}
                  className="p-4 bg-white/[0.02] border-l-2 border-indigo-500 rounded-r-xl flex justify-between items-center cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold">Workflow_Alpha_Update</p>
                    <p className="text-xs text-slate-500">Processed 1.2k tokens</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">2m ago</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Resource Monitor */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-white/[0.03] border-white/10 p-6 relative overflow-hidden">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Cpu size={20} className="text-blue-400" /> Resource Load
            </h2>
            <div className="flex items-end gap-2 h-32">
              {[40, 70, 45, 90, 65, 80, 95, 60, 75].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 1, delay: i * 0.1, repeat: Infinity, repeatType: 'reverse' }}
                  className="flex-1 bg-gradient-to-t from-indigo-600 to-purple-400 rounded-t-sm opacity-60"
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs font-mono text-slate-500">
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}

// Helper Component for Stats
function StatCard({ icon, title, value, color }) {
  return (
    <motion.div variants={cardHover} initial="rest" whileHover="hover">
      <Card className={`relative overflow-hidden bg-white/[0.03] border-white/10 backdrop-blur-md p-6 group`}>
        {/* Glow behind icon */}
        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${color} blur-2xl rounded-full transition-all group-hover:scale-150`} />
        
        <div className="relative z-10">
          <div className="mb-4 p-3 bg-white/5 w-fit rounded-2xl border border-white/10">
            {icon}
          </div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <motion.p 
            initial={{ scale: 0.5 }} 
            animate={{ scale: 1 }} 
            className="text-4xl font-black mt-1 tracking-tight"
          >
            {value}
          </motion.p>
        </div>
      </Card>
    </motion.div>
  );
}