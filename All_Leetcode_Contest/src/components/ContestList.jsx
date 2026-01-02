import { useState, useEffect } from 'react';
import { Calendar, Filter, Play, Trophy } from 'lucide-react';
import { fetchLeetCode, QUERIES } from '../api';
import Dropdown from './Dropdown';

export default function ContestList({ onSelectContest }) {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState("");

    // Dynamic Years
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - i);

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            let allData = [];
            const perPage = 50;
            let total = 0;

            try {
                const first = await fetchLeetCode(QUERIES.pastContests, { pageNo: 1, numPerPage: perPage });
                if (!first?.pastContests) return;

                const metaTotal = first.pastContests.totalNum;
                allData = [...first.pastContests.data];
                total = metaTotal;

                // API might limit items per page to 10 even if we ask for 50
                const actualPerPage = first.pastContests.data.length || 10;
                const totalPages = Math.ceil(total / actualPerPage);

                const remainingPages = [];
                for (let i = 2; i <= totalPages; i++) remainingPages.push(i);

                const BATCH_SIZE = 10; // Increased batch size for more pages
                for (let i = 0; i < remainingPages.length; i += BATCH_SIZE) {
                    const batch = remainingPages.slice(i, i + BATCH_SIZE);
                    const promises = batch.map(p => fetchLeetCode(QUERIES.pastContests, { pageNo: p, numPerPage: perPage }));
                    const results = await Promise.all(promises);

                    results.forEach(res => {
                        if (res?.pastContests?.data) {
                            allData.push(...res.pastContests.data);
                        }
                    });

                }

                setContests(allData);

            } catch (err) {
                console.error("Failed to fetch contests", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const filtered = contests.filter(c => {
        const d = new Date(c.startTime * 1000);
        return d.getFullYear() === parseInt(year) && (d.getMonth() + 1) === parseInt(month);
    });

    return (
        <div className="space-y-6">
            {/* Filters - Sticky */}
            <div className="flex flex-wrap gap-4 p-4 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl items-center sticky top-4 z-40 shadow-lg dark:shadow-xl transition-colors duration-300">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <Filter size={14} /> Filter
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block" />

                <Dropdown
                    value={year}
                    onChange={setYear}
                    options={years.map(y => ({ value: y, label: y }))}
                />

                <Dropdown
                    value={month}
                    onChange={setMonth}
                    options={Array.from({ length: 12 }, (_, i) => i + 1).map(m => ({
                        value: m,
                        label: new Date(0, m - 1).toLocaleString('default', { month: 'long' })
                    }))}
                />

                <div className="ml-auto text-xs text-slate-500 dark:text-slate-500 font-mono hidden sm:block">
                    Found {filtered.length} contests
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500 animate-pulse gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-emerald-500 animate-spin" />
                    <span className="font-mono text-xs">Loading Archive...</span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-neutral-900/30">
                    <Trophy size={48} className="text-slate-300 dark:text-slate-800 mb-2" />
                    <p className="font-medium text-slate-600 dark:text-slate-400">No contests found for this period.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((contest, i) => (
                        <div
                            key={contest.titleSlug}
                            onClick={() => onSelectContest(contest)}
                            className="group relative bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200 dark:border-white/5 hover:border-emerald-400 dark:hover:border-emerald-500/50 p-5 rounded-xl cursor-pointer transition-all hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 overflow-hidden"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            {/* Subtle hover gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 dark:from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-black/40 px-2 py-1 rounded border border-slate-200 dark:border-white/5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:border-emerald-200 dark:group-hover:border-emerald-500/20 transition-colors">
                                        {new Date(contest.startTime * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                        <Play size={14} fill="currentColor" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-white transition-colors line-clamp-2 leading-tight">
                                    {contest.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
