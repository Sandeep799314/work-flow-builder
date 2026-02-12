export default function Textarea({
  placeholder = "",
  value,
  onChange,
  rows = 5,
  className = "",
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`
        w-full
        bg-white/5
        border border-white/10
        rounded-xl
        px-4 py-3
        text-white
        placeholder-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500/50
        focus:border-indigo-500/50
        transition-all
        duration-200
        resize-none
        ${className}
      `}
    />
  );
}
