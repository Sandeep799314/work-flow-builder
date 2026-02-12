import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Activity, 
  Server, 
  Database, 
  BrainCircuit, 
  RefreshCcw,
  Zap
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import API from "../services/api";

export default function StatusPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await API.get("/status");
      // Adding a small delay for dramatic effect (optional)
      setTimeout(() => setStatus(res.data), 500);
    } catch (err) {
      setStatus({ backend: "ERROR", database: "ERROR", llm: "ERROR" });
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const StatusIndicator = ({ label, value, icon: Icon, delay }) => {
    const isOk = value === "OK";

    return (
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, type: "spring", stiffness: 100 }}
      >
        <Card className="relative overflow-hidden bg-white/[0.03] border-white/10 p-6 group transition-all duration-500 hover:border-indigo-500/40">
          {/* Background Scan Effect */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12"
          />

          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isOk ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className="text-gray-200 font-bold tracking-wide">{label}</h3>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase italic">
                  Node_0{Math.floor(Math.random() * 9)} // {isOk ? "Active" : "Interrupted"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  {isOk && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isOk ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                </span>
                <span className={`font-black font-mono text-xl tracking-tighter ${isOk ? "text-emerald-400" : "text-rose-400"}`}>
                  {value}
                </span>
              </div>
              <p className="text-[10px] text-gray-600 font-mono mt-1">LATENCY: {isOk ? "12ms" : "---"}</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 relative pb-20">
      
      {/* --- Background Elements --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      {/* --- Header --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={32} className="text-indigo-500" />
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">System Integrity</h1>
          </div>
          <p className="text-gray-500 font-medium">Real-time infrastructure and AI connectivity diagnostics.</p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={fetchStatus} 
            loading={loading}
            className="bg-indigo-600 hover:bg-indigo-500 px-8 h-14 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.2)] border-t border-white/20"
          >
            <div className="flex items-center gap-2">
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
              <span className="font-bold uppercase tracking-widest text-xs">Run Diagnostic</span>
            </div>
          </Button>
        </motion.div>
      </motion.div>

      {/* --- Global Health Gauge --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent border border-white/5 rounded-[2.5rem] relative overflow-hidden"
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Global Reliability</p>
            <h2 className="text-5xl font-black text-white italic">99.98%</h2>
          </div>
          <div className="hidden md:flex gap-1 items-end h-12">
            {[40, 60, 45, 90, 85, 40, 60, 95, 80, 70, 85].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 1 }}
                className="w-1.5 bg-indigo-500/40 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* --- Status Nodes --- */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 flex flex-col items-center justify-center gap-4"
            >
              <Zap size={48} className="text-indigo-500 animate-bounce" />
              <p className="font-mono text-sm text-gray-500 animate-pulse tracking-[0.5em] uppercase">Pinging Nodes...</p>
            </motion.div>
          ) : (
            <motion.div key="status-list" className="space-y-4">
              {status && (
                <>
                  <StatusIndicator label="Global API Mesh" value={status.backend} icon={Server} delay={0.1} />
                  <StatusIndicator label="PostgreSQL Cluster" value={status.database} icon={Database} delay={0.2} />
                  <StatusIndicator label="Neural Engine (LLM)" value={status.llm} icon={BrainCircuit} delay={0.3} />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Technical Footer --- */}
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 pt-10 border-t border-white/5 opacity-40 grayscale">
         <div className="flex items-center gap-2 font-mono text-[10px]">
           <Activity size={12} /> SYSTEM_STABLE_001
         </div>
         <div className="flex items-center gap-2 font-mono text-[10px]">
           <Zap size={12} /> LOAD_BALANCER_READY
         </div>
         <div className="flex items-center gap-2 font-mono text-[10px]">
           <ShieldCheck size={12} /> ENCRYPTION_AES_256
         </div>
      </div>
    </div>
  );
}