import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Timer, ExternalLink } from 'lucide-react';

export default function FocusModal({ contest, onClose }) {
    const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const audioRef = useRef(null);

    // Beep Sound (Data URI for simplicity)
    const BEEP_URL = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            playAlarm();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const playAlarm = () => {
        let count = 0;
        const play = () => {
            if (count >= 3) return;
            const audio = new Audio(BEEP_URL);
            audio.play().catch(e => console.error(e));
            audio.onended = () => {
                count++;
                setTimeout(play, 500);
            };
        };
        play();
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 dark:bg-slate-950/90 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors z-10 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                    <X size={24} />
                </button>

                <div className="p-8 text-center space-y-6 flex-1 flex flex-col justify-center">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{contest.title}</h2>
                        <div className="text-emerald-600 dark:text-emerald-400 font-mono font-medium text-sm tracking-wide bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-emerald-200 dark:border-emerald-500/20">
                            Virtual Contest Mode
                        </div>
                    </div>

                    {/* Timer */}
                    <div className="py-6 relative">
                        <div className={`text-6xl sm:text-8xl font-black font-mono tracking-tighter tabular-nums transition-colors ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-800 dark:text-slate-100'}`}>
                            {formatTime(timeLeft)}
                        </div>
                        {timeLeft === 0 && <div className="text-emerald-500 font-bold mt-2 text-xl animate-bounce">TIME IS UP!</div>}
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-4 sm:gap-6">
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all transform active:scale-95 shadow-lg ${isActive
                                    ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:hover:bg-amber-500/20'
                                    : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 hover:shadow-xl'
                                }`}
                        >
                            {isActive ? <><Pause fill="currentColor" size={20} /> Pause</> : <><Play fill="currentColor" size={20} /> Start Timer</>}
                        </button>

                        <button
                            onClick={() => { setIsActive(false); setTimeLeft(90 * 60); }}
                            className="p-4 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                            title="Reset Timer"
                        >
                            <RotateCcw size={24} />
                        </button>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="bg-slate-50 dark:bg-black/20 p-6 border-t border-slate-200 dark:border-slate-800 text-center">
                    <a
                        href={`https://leetcode.com/contest/${contest.titleSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-lg shadow-lg hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span>Open Contest Problems on LeetCode</span>
                        <ExternalLink size={20} strokeWidth={2.5} />
                    </a>
                </div>
            </div>
        </div>
    );
}
