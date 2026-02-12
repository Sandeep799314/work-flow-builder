import { Search, Bell, Command, Cpu, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Topbar({ activePage }) {
  // Mapping titles for cleaner display
  const titles = {
    dashboard: "Analytics Overview",
    create: "Workflow Architect",
    run: "Execution Engine",
    history: "Neural Archives",
    status: "System Core",
  };

  return (
    <div className="h-20 px-8 flex items-center justify-between border-b border-white/[0.05] bg-[#050507]/60 backdrop-blur-xl sticky top-0 z-40">
      
      {/* --- Left Section: Page Context --- */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-indigo-500 to-transparent hidden md:block" />
        <motion.div
          key={activePage}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-lg font-black tracking-tight text-white uppercase italic">
            {titles[activePage] || "AI Command"}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
              Operational / 
            </span>
            <span className="text-[10px] text-indigo-400 font-mono font-bold">
              v2.0.4-stable
            </span>
          </div>
        </motion.div>
      </div>

      {/* --- Center Section: Global Search (Visual Only) --- */}
      <div className="hidden lg:flex items-center bg-white/[0.03] border border-white/10 px-4 py-2 rounded-2xl w-96 group focus-within:border-indigo-500/50 transition-all">
        <Search size={16} className="text-gray-500 group-focus-within:text-indigo-400" />
        <input 
          type="text" 
          placeholder="Search neural patterns..." 
          className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-full text-gray-300 placeholder:text-gray-600"
        />
        <div className="flex items-center gap-1 ml-2">
          <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-gray-500 font-sans font-bold">
             <Command size={10} className="inline mr-1" /> K
          </kbd>
        </div>
      </div>

      {/* --- Right Section: Status & Actions --- */}
      <div className="flex items-center gap-6">
        
        {/* Metric (Hidden on mobile) */}
        <div className="hidden xl:flex items-center gap-4 border-r border-white/10 pr-6">
          <div className="text-right">
            <p className="text-[9px] text-gray-600 font-black uppercase tracking-tighter">AI Load</p>
            <p className="text-xs font-mono text-indigo-400">24.8%</p>
          </div>
          <Cpu size={18} className="text-gray-700" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all relative">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full border border-[#050507]" />
          </button>
          
          {/* Live Indicator Dot */}
          <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-2xl">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Scanning Line Effect */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}