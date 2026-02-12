import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Play, 
  History, 
  ShieldCheck, 
  Zap 
} from "lucide-react";

export default function Sidebar({ setPage }) {
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "create", label: "Create Workflow", icon: PlusCircle },
    { id: "run", label: "Run Workflow", icon: Play },
    { id: "history", label: "Run History", icon: History },
    { id: "status", label: "System Status", icon: ShieldCheck },
  ];

  const handleClick = (id) => {
    setActive(id);
    setPage(id);
  };

  return (
    <div className="w-72 bg-[#0a0a0c]/80 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col h-screen sticky top-0">
      
      {/* --- Logo Section --- */}
      <div className="mb-12 flex items-center gap-3 px-2">
        <div className="p-2 bg-indigo-500 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)]">
          <Zap size={20} className="text-white fill-current" />
        </div>
        <div>
          <h1 className="text-xl font-black bg-gradient-to-r from-indigo-300 via-purple-400 to-indigo-300 bg-clip-text text-transparent tracking-tight">
            WORKFLOW AI
          </h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase">
            Hyper-Drive v2.0
          </p>
        </div>
      </div>

      {/* --- Navigation --- */}
      <nav className="flex-1 space-y-1 relative">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`
                w-full relative flex items-center gap-4 px-4 py-3.5 rounded-xl 
                transition-all duration-300 group outline-none
                ${isActive ? "text-white" : "text-gray-500 hover:text-gray-300"}
              `}
            >
              {/* Active Background Animation */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/10 border border-indigo-500/20 rounded-xl z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon & Label */}
              <div className="relative z-10 flex items-center gap-4">
                <Icon 
                  size={20} 
                  className={`transition-transform duration-300 group-hover:scale-110 
                    ${isActive ? "text-indigo-400" : "text-gray-500"}
                  `} 
                />
                <span className="text-sm font-bold tracking-wide">
                  {item.label}
                </span>
              </div>

              {/* Active Dot */}
              {isActive && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* --- Footer / User Section --- */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="p-3 bg-white/[0.02] rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
            JS
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-gray-300 truncate">System Admin</p>
            <p className="text-[10px] text-gray-600 font-mono">ID: 0x94...FF</p>
          </div>
        </div>
        <p className="mt-4 text-[10px] text-gray-600 text-center font-mono">
          © 2024 CORE-OS
        </p>
      </div>
    </div>
  );
}