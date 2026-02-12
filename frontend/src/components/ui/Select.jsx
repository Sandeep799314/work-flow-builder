export default function Select({
  options = [],
  value,
  onChange,
  className = "",
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`
          w-full
          appearance-none
          bg-white/5
          border border-white/10
          rounded-xl
          px-4 py-3
          pr-10
          text-white
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-500/50
          focus:border-indigo-500/50
          transition-all
          duration-200
          ${className}
        `}
      >
        <option value="" className="bg-gray-900">
          Select option
        </option>

        {options.map((option, index) => (
          <option
            key={index}
            value={option.value}
            className="bg-gray-900"
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom Arrow */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        ▼
      </div>
    </div>
  );
}
