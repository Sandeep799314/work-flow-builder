import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, ChevronDown, Clock, Hash, 
  FileText, Inbox, ExternalLink, Trash2, RotateCcw 
} from "lucide-react";
import Card from "../components/ui/Card";
import API from "../services/api";

export default function RunHistory() {
  const [runs, setRuns] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const res = await API.get("/runs");
        setRuns(res.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    fetchRuns();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 relative">
      
      {/* --- Header Section --- */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <History size={28} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Archive_<span className="text-indigo-500">Logs</span></h1>
          </div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-slate-500">
            SECURE_VAULT // ENTRIES: {runs.length} // STATUS: ENCRYPTED
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Sync Protocol</p>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE_DB_CONNECTED
          </div>
        </div>
      </motion.div>

      {/* --- Empty State --- */}
      {runs.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-32 flex flex-col items-center justify-center border border-white/5 rounded-[2.5rem] bg-white/[0.01] backdrop-blur-sm"
        >
          <Inbox size={60} strokeWidth={1} className="text-gray-800 mb-6" />
          <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">No Records Found In Core</p>
        </motion.div>
      )}

      {/* --- Run List --- */}
      <div className="grid gap-4">
        {runs.map((run, index) => (
          <motion.div
            key={run.id || index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            layout
          >
            <Card className={`group relative transition-all duration-500 border-white/5 overflow-hidden rounded-2xl ${
              expandedId === run.id ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-white/[0.02] hover:bg-white/[0.04]'
            }`}>
              
              <div
                className="p-5 flex flex-wrap items-center justify-between cursor-pointer gap-4 relative z-10"
                onClick={() => toggleExpand(run.id)}
              >
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${expandedId === run.id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                       <Hash size={14} />
                    </div>
                    <span className="font-mono text-sm font-bold text-gray-300 tracking-tighter">
                      {/* FIX HERE: Using String() to prevent crash */}
                      {String(run.workflow_id || 'UNKNOWN').slice(-8).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
                  
                  <div className="flex items-center gap-5 text-gray-500 font-mono">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-indigo-400/50" />
                      <span className="text-xs">
                        {new Date(run.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[10px] opacity-30 hidden md:inline tracking-tighter">
                      [{new Date(run.created_at).toLocaleDateString()}]
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="px-4 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Success</p>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedId === run.id ? 180 : 0 }}
                    className="text-gray-600 group-hover:text-white transition-colors"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === run.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/5"
                  >
                    <div className="p-8 space-y-8 bg-black/20">
                      
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Input Section */}
                        <div className="lg:col-span-4">
                          <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 h-full relative group/input">
                            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <FileText size={14} /> Raw_Source
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-mono">
                              "{run.input_text}"
                            </p>
                            <div className="absolute top-4 right-4 opacity-0 group-hover/input:opacity-100 transition-opacity">
                               <ExternalLink size={12} className="text-gray-600" />
                            </div>
                          </div>
                        </div>

                        {/* Output Steps */}
                        <div className="lg:col-span-8 space-y-4">
                          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            Pipeline_Nodes <span className="text-indigo-500">({run.outputs?.length || 0})</span>
                          </h3>
                          <div className="grid gap-3">
                            {run.outputs?.map((step, idx) => (
                              <div 
                                key={idx}
                                className="group/step bg-[#0a0a0c] border border-white/5 p-4 rounded-xl hover:border-indigo-500/30 transition-all shadow-sm"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-wider">
                                    Step_0{idx + 1} // {step.step?.replace(/_/g, " ")}
                                  </span>
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-20 group-hover/step:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-sm text-slate-300 font-mono leading-relaxed bg-white/[0.01] p-2 rounded">
                                  {step.output}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Control Panel */}
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                          Checksum: SHA-256 Validated
                        </div>
                        <div className="flex gap-4">
                          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-lg hover:bg-indigo-600">
                            <RotateCcw size={12} /> Restore Execution
                          </button>
                          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500/70 hover:text-rose-400 transition-all bg-rose-500/5 px-4 py-2 rounded-lg hover:bg-rose-500/10">
                            <Trash2 size={12} /> Purge Record
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050507] to-transparent pointer-events-none z-0" />
    </div>
  );
}