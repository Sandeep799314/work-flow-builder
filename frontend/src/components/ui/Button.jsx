export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  className = "",
}) {
  const base =
    "px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white shadow-lg shadow-indigo-500/20",
    secondary:
      "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700",
    danger:
      "bg-red-600 hover:bg-red-500 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${base} ${variants[variant]} ${className} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}
