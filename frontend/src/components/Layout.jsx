import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children, setPage, activePage }) {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 flex overflow-hidden font-sans">
      
      {/* --- Global Background Glows (Futuristic Vibe) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* --- Sidebar (Fixed Left) --- */}
      <Sidebar setPage={setPage} activePage={activePage} />

      {/* --- Main Section --- */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0 h-screen">
        
        {/* Topbar (Sticky Top) */}
        <Topbar activePage={activePage} />

        {/* --- Page Content Container --- */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white/[0.01]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage} // Isse transition trigger hoga har page change par
              initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Space for padding */}
          <div className="h-20" />
        </main>
      </div>

      {/* --- Custom Scrollbar CSS --- */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </div>
  );
}