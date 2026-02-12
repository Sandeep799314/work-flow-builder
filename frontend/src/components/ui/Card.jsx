export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white/5 
        backdrop-blur-xl 
        border border-white/10 
        rounded-2xl 
        p-6 
        shadow-xl 
        shadow-black/20 
        transition-all 
        duration-300 
        hover:border-indigo-500/40
        ${className}
      `}
    >
      {children}
    </div>
  );
}
