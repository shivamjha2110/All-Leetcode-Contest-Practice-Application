import { useState, useEffect } from 'react';
import Header from './components/Header';
import ContestList from './components/ContestList';
import FocusModal from './components/FocusModal';
import { Trophy, Activity, TrendingUp } from 'lucide-react';

function App() {
    const [username, setUsername] = useState(() => localStorage.getItem('lc_username') || '');
    const [selectedContest, setSelectedContest] = useState(null);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    // Sync username to LS
    useEffect(() => {
        if (username) localStorage.setItem('lc_username', username);
    }, [username]);

    // Apply Theme
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Section */}
                <Header
                    username={username}
                    setUsername={setUsername}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Main Contest Archive (Left 2 cols) */}
                    <div className="md:col-span-3">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 shrink-0">
                                <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">All Leetcode Contest</h2>
                        </div>
                        <ContestList onSelectContest={setSelectedContest} />
                    </div>

                </div>
            </div>

            {/* Focus Mode Overlay */}
            {selectedContest && (
                <FocusModal
                    contest={selectedContest}
                    onClose={() => setSelectedContest(null)}
                />
            )}
        </div>
    );
}

export default App;
