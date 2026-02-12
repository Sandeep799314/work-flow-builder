import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Terminal, Sparkles, Cpu, CheckCircle, 
  AlertCircle, Zap, Box, Layers, Radio
} from "lucide-react";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import API from "../services/api";

export default function RunWorkflow() {
  const [workflows, setWorkflows] = useState([]);
  const [selected, setSelected] = useState("");
  const [text, setText] = useState("");
  const [outputs, setOutputs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const res = await API.get("/workflows");
        setWorkflows(res.data);
      } catch (err) { console.error(err); }
    };
    fetchWorkflows();
  }, []);

  const handleRun = async () => {
    if (!selected || !text.trim()) {
      setError("Input required for neural processing.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setOutputs([]);
      const res = await API.post(`/run/${selected}`, { input_text: text });
      setOutputs(res.data.outputs);
    } catch (err) {
      setError("CRITICAL_FAILURE: Execution sequence interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-slate-300 p-4 md:p-10 selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* --- Background Cyber-Grid & Blobs --- */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />

      {/* --- Header: Mission Control --- */}
      <header className="relative z-10 max-w-6xl mx-auto mb-16 flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-10">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Cpu size={40} className="text-indigo-400 relative z-10" />
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-indigo-500 rounded-full blur-md" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white italic italic">NEURAL<span className="text-indigo-500">CORE</span></h1>
          </div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-indigo-400 uppercase">Status: System_Ready // Priority: Alpha</p>
        </motion.div>

        <div className="hidden md:grid grid-cols-2 gap-8 font-mono">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase">Core Voltage</p>
            <p className="text-xl font-bold text-white">1.24v</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase">Active Threads</p>
            <p className="text-xl font-bold text-white">128</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* --- Left: Input Matrix --- */}
        <section className="lg:col-span-5 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="relative p-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-none shadow-2xl">
              <div className="bg-[#0a0a0c] p-6 rounded-[inherit] space-y-8">
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-indigo-400" />
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Select Pipeline</label>
                  </div>
                  <Select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    options={workflows.map((wf) => ({ label: wf.name, value: wf.id }))}
                    className="bg-white/5 border-white/10 hover:border-indigo-500/50 transition-all h-12"
                  />
                </div>

                <div className="space-y-4 relative">
                  <div className="flex items-center gap-2">
                    <Radio size={16} className="text-purple-400" />
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Data Stream Input</label>
                  </div>
                  <div className="relative group">
                    <Textarea
                      placeholder="// ENTER_RAW_DATA_HERE..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={10}
                      className="bg-black/60 border-white/10 focus:ring-1 ring-indigo-500 font-mono text-sm leading-relaxed p-4 rounded-xl transition-all"
                    />
                    <div className="absolute inset-0 pointer-events-none border border-indigo-500/0 group-hover:border-indigo-500/20 rounded-xl transition-all" />
                  </div>
                </div>

                <Button 
                  onClick={handleRun} 
                  disabled={loading}
                  className={`w-full h-16 rounded-xl font-black text-lg tracking-widest transition-all duration-500 ${
                    loading ? 'bg-slate-800' : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-indigo-500/60'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Zap className="animate-bounce text-yellow-400" />
                      <span>SYNCHRONIZING...</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2"> <Play fill="currentColor" size={20} /> EXECUTE SEQUENCE </span>
                  )}
                </Button>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3 text-rose-400 text-xs font-mono">
                      <AlertCircle size={16} /> {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* --- Middle: Animated Bridge (Visible on Desktop) --- */}
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
          <div className="h-full w-[2px] bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent relative">
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-[-4px] w-2.5 h-12 bg-indigo-500 blur-sm rounded-full"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- Right: Output Console --- */}
        <section className="lg:col-span-6 space-y-6">
          <div className="bg-[#0a0a0c]/80 border border-white/10 rounded-3xl p-6 min-h-[600px] backdrop-blur-3xl relative overflow-hidden">
            
            {/* Console Header */}
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-emerald-400" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500">Output_Terminal</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {loading ? (
                <motion.div 
                  key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-[400px] text-center space-y-6"
                >
                  <div className="relative">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-24 h-24 border-t-2 border-r-2 border-indigo-500 rounded-full" />
                    <Box size={32} className="absolute inset-0 m-auto text-indigo-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-mono text-sm text-indigo-400 animate-pulse">EXTRACTING_NEURAL_PATTERNS...</p>
                    <p className="font-mono text-[10px] text-slate-600 mt-2">Latency: 42ms // Packet: Received</p>
                  </div>
                </motion.div>
              ) : outputs.length > 0 ? (
                <motion.div key="results" className="space-y-6">
                  {outputs.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="relative pl-6 border-l-2 border-indigo-500/30 group"
                    >
                      <div className="absolute left-[-9px] top-0 w-4 h-4 bg-[#0a0a0c] border-2 border-indigo-500 rounded-full group-hover:scale-125 transition-transform" />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Layer_0{index + 1}: {step.step}</h4>
                          <CheckCircle size={14} className="text-emerald-500/50" />
                        </div>
                        <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                          <p className="font-mono text-sm text-slate-300 leading-relaxed">
                            {step.output}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[400px] opacity-20">
                  <Sparkles size={60} strokeWidth={1} className="mb-4" />
                  <p className="font-mono text-sm tracking-widest uppercase italic">Awaiting neural trigger...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Matrix Rain Decoration (Subtle) */}
            <div className="absolute bottom-4 right-6 font-mono text-[8px] text-indigo-500/20 select-none">
              01011001 01001111 01010101
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}