import { useState, useEffect } from 'react';
import { Search, User, Zap, Hash, Trophy, Calendar, ExternalLink, Clock, Target, Award, Sun, Moon } from 'lucide-react';
import { fetchLeetCode, QUERIES } from '../api';

export default function Header({ username, setUsername, theme, toggleTheme }) {
    const [stats, setStats] = useState(null);
    const [ranking, setRanking] = useState(null);
    const [upcoming, setUpcoming] = useState({ weekly: null, biweekly: null });
    const [inputVal, setInputVal] = useState(username);
    const [loading, setLoading] = useState(false);

    // Fetch User Stats (Real-Time Polling)
    useEffect(() => {
        if (!username) {
            setStats(null);
            setRanking(null);
            return;
        }

        const fetchUser = () => {
            // Only show spinner on initial load, not during background refresh
            if (!stats) setLoading(true);

            fetchLeetCode(QUERIES.userProfile, { username })
                .then(data => {
                    if (data?.matchedUser) setStats(data.matchedUser);
                    if (data?.userContestRanking) setRanking(data.userContestRanking);
                })
                .finally(() => setLoading(false));
        };

        // Initial Fetch
        setStats(null);
        setRanking(null);
        fetchUser();

        // Poll every 5 minutes to keep Rank/Rating fresh
        const interval = setInterval(fetchUser, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [username]);

    // Fetch UPCOMING Contests (Real-Time from API)
    useEffect(() => {
        const fetchUpcoming = () => {
            fetchLeetCode(QUERIES.contestUpcoming)
                .then(data => {
                    if (data?.topTwoContests) {
                        // Sort by start time
                        const sorted = [...data.topTwoContests].sort((a, b) => a.startTime - b.startTime);

                        // Identify Weekly/Biweekly based on title content
                        let w = sorted.find(c => c.title.includes("Weekly"));
                        let b = sorted.find(c => c.title.includes("Biweekly"));

                        if (w) w.type = 'Weekly';
                        if (b) b.type = 'Biweekly';

                        setUpcoming({ weekly: w, biweekly: b });
                    }
                });
        };

        fetchUpcoming();
        // Poll every 10 minutes to auto-update
        const interval = setInterval(fetchUpcoming, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputVal.trim()) setUsername(inputVal.trim());
    };

    return (
        <div className="space-y-4">

            {/* 1. Profile Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* Left: User Identity */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-center relative overflow-hidden min-h-[120px] transition-colors duration-300">
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 dark:from-slate-800/30 to-transparent pointer-events-none" />

                    {/* Theme Toggle (Top Right) */}
                    <button
                        onClick={toggleTheme}
                        className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all z-20"
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    {!username ? (
                        <div className="flex flex-col h-full justify-center space-y-3 z-10">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">LeetCode Profile</h2>
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputVal}
                                    onChange={(e) => setInputVal(e.target.value)}
                                    placeholder="Enter username"
                                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-600 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                                />
                                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors">Sync</button>
                            </form>
                        </div>
                    ) : (
                        <div className="relative z-10 flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 shadow-md">
                                {stats?.profile?.userAvatar ? (
                                    <img src={stats.profile.userAvatar} alt={`${username}'s Avatar`} className="w-full h-full object-cover" />
                                ) : <div className="p-3 text-slate-400 flex items-center justify-center h-full"><User size={28} /></div>}
                            </div>

                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate mr-8" title={stats?.profile?.realName || username}>
                                        {stats?.profile?.realName || username}
                                    </h2>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-xs truncate font-mono mb-2">@{username}</p>

                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950/50 w-fit px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Rank</span>
                                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                                        {stats?.profile?.ranking?.toLocaleString() || 'N/A'}
                                    </span>
                                </div>

                                {/* Hidden Switch/Logout button overlay on Avatar or separate */}
                                <button
                                    onClick={() => setUsername('')}
                                    className="absolute bottom-3 right-3 text-[10px] font-semibold text-slate-400 hover:text-emerald-500 px-2 py-1 transition-colors"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Middle/Right: Stats Grid */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 relative flex items-center min-h-[120px] transition-colors duration-300">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
                        <StatItem
                            label="Contest Rating"
                            value={ranking?.rating ? Math.round(ranking.rating) : 'N/A'}
                            sub={ranking?.badge?.name}
                            icon={<Trophy size={16} className="text-yellow-600 dark:text-yellow-500" aria-hidden="true" />}
                            active={!!ranking}
                        />
                        <StatItem
                            label="Global Rank"
                            value={ranking?.globalRanking?.toLocaleString() || stats?.profile?.ranking?.toLocaleString() || 'N/A'}
                            icon={<Hash size={16} className="text-blue-600 dark:text-blue-500" aria-hidden="true" />}
                            active={!!ranking || !!stats?.profile?.ranking}
                        />
                        <StatItem
                            label="Attended"
                            value={ranking?.attendedContestsCount || 0}
                            icon={<Calendar size={16} className="text-emerald-600 dark:text-emerald-500" aria-hidden="true" />}
                            active={!!ranking}
                        />
                        <StatItem
                            label="Top Percentage"
                            value={ranking?.topPercentage ? `${ranking?.topPercentage}%` : '--'}
                            icon={<Target size={16} className="text-purple-600 dark:text-purple-500" aria-hidden="true" />}
                            active={!!ranking}
                        />
                    </div>
                </div>
            </div>

            {/* 2. Upcoming Contests */}
            <div>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-wider pl-1 transition-colors">
                    <Clock size={16} /> Upcoming Contests
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LeetCodeCard contest={upcoming.weekly} style="blue" />
                    <LeetCodeCard contest={upcoming.biweekly} style="teal" />
                </div>
            </div>

        </div>
    );
}

// Accessible Stat Item
function StatItem({ label, value, sub, icon, active }) {
    return (
        <div className={`flex flex-col ${!active ? 'opacity-50' : ''}`}>
            <div className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-slate-500 dark:text-slate-400`}>
                {icon} {label}
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-none flex items-baseline gap-2 transition-colors">
                {value}
                {sub && (
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium transform -translate-y-0.5">
                        {sub}
                    </span>
                )}
            </div>
        </div>
    );
}

function Countdown({ startTime }) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const calculate = () => Math.max(0, startTime * 1000 - Date.now());
        setTimeLeft(calculate());
        const interval = setInterval(() => setTimeLeft(calculate()), 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return <span className="font-mono tabular-nums font-bold">{days}d {hours}h {minutes}m {seconds}s</span>;
}

// Balanced Cards
function LeetCodeCard({ contest, style }) {
    if (!contest) return <div className="rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse h-32" />;

    const isBlue = style === 'blue';

    // Light Mode: Subtle gradient or solid
    // Dark Mode: Deep gradient
    const gradient = isBlue
        ? 'bg-gradient-to-r from-blue-50 via-white to-white dark:from-blue-950 dark:via-slate-900 dark:to-slate-900'
        : 'bg-gradient-to-r from-emerald-50 via-white to-white dark:from-emerald-950 dark:via-slate-900 dark:to-slate-900';

    const borderHover = isBlue ? 'hover:border-blue-300 dark:hover:border-blue-500/50' : 'hover:border-emerald-300 dark:hover:border-emerald-500/50';
    const iconColor = isBlue ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400';
    const highlightBg = isBlue ? 'bg-blue-100 dark:bg-blue-500/20' : 'bg-emerald-100 dark:bg-emerald-500/20';
    const titleColor = 'text-slate-900 dark:text-white';
    const dateColor = 'text-slate-500 dark:text-slate-400';

    const dateStr = new Date(contest.startTime * 1000).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

    return (
        <a
            href={`https://leetcode.com/contest/${contest.titleSlug}`}
            target="_blank"
            rel="noreferrer"
            className={`group relative h-32 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${gradient} ${borderHover}`}
            aria-label={`Join ${contest.title}`}
        >
            {/* Noise overlay only on Dark Mode maybe, or subtle on both */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-0 dark:opacity-5 mix-blend-overlay"></div>

            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-bold mb-2 ${highlightBg} ${iconColor}`}>
                            <Clock size={12} />
                            <span>Starts in <Countdown startTime={contest.startTime} /></span>
                        </div>
                        <h3 className={`text-xl font-bold ${titleColor} leading-tight transition-colors`}>
                            {contest.title}
                        </h3>
                    </div>
                    <div className={`p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 ${iconColor} shadow-sm dark:shadow-none`}>
                        <Calendar size={18} />
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-3 mt-1">
                    <span className={`text-xs font-medium ${dateColor}`}>{dateStr}</span>
                    <span className={`flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-white/70 group-hover:text-emerald-600 dark:group-hover:text-white transition-colors`}>
                        Register Now <ExternalLink size={12} />
                    </span>
                </div>
            </div>
        </a>
    );
}
