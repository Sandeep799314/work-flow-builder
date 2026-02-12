export default function Loader({ text = "Processing..." }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-10">
      {/* Animated Glow Circle */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 blur-xl opacity-70 animate-pulse"></div>
        <div className="relative w-16 h-16 rounded-full border-4 border-white/10 border-t-indigo-500 animate-spin"></div>
      </div>

      {/* Text */}
      <p className="text-gray-300 text-sm tracking-wide animate-pulse">
        {text}
      </p>
    </div>
  );
}
