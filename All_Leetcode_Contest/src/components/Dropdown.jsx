import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function Dropdown({ value, options, onChange, label }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value) || options[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-lg px-4 py-2 text-sm hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-black/50 transition-all outline-none focus:ring-2 focus:ring-emerald-500/20 min-w-[120px] justify-between group"
            >
                <span className="font-medium text-slate-600 dark:text-slate-300">{selectedOption?.label}</span>
                <ChevronDown
                    size={14}
                    className={`text-slate-400 group-hover:text-emerald-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-full min-w-[160px] max-h-60 overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 p-1 flex flex-col gap-0.5 custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors text-left
                                ${value == option.value
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'}
                            `}
                        >
                            {option.label}
                            {value == option.value && <Check size={12} className="text-emerald-500" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Add simple scrollbar styles to index.css if not present, but for now this is fine.
