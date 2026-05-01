import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [interactions, setInteractions] = useState({
    dashboard: 0,
    reports: 0,
    settings: 0,
  });

  const [aiStatus, setAiStatus] = useState('idle');
  const [suggestion, setSuggestion] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [cards, setCards] = useState([
    { id: 'ana', title: 'Analytics', value: '98%' },
    { id: 'rev', title: 'Revenue', value: '$12K' },
    { id: 'rep', title: 'Reports', value: '14 Pending' },
  ]);

  // Track user actions
  const trackAction = (type) => {
    setActiveTab(type);

    const updated = {
      ...interactions,
      [type]: interactions[type] + 1,
    };

    setInteractions(updated);
    setAiStatus('thinking');

    // Simulate AI Processing delay
    setTimeout(() => {
      setAiStatus('complete');
      processAI(updated, type);
    }, 800);
  };

  // AI Logic for Adaptive UI
  const processAI = (data, last) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);

    // Suggest shortcut if total interactions > 3
    if (total >= 3 && !suggestion) {
      setSuggestion({
        title: 'Nexus Insight',
        desc: `You've accessed ${last} frequently. Create a quick-action shortcut?`,
        action: 'Enable',
      });
    }

    // Move "Reports" to front if used 3+ times
    if (data.reports >= 3) {
      setCards((prev) => {
        const rep = prev.find((c) => c.id === 'rep');
        const others = prev.filter((c) => c.id !== 'rep');
        // Prevent duplicate moving if already at front
        if (prev[0].id === 'rep') return prev;
        return [rep, ...others];
      });
    }
  };

  const simulateVoice = () => {
    setAiStatus('thinking');
    setTimeout(() => {
      trackAction('reports');
      setSuggestion({
        title: 'Voice Command',
        desc: 'Identified: "Open my reports". Syncing data...',
        action: 'View',
      });
      setAiStatus('complete');
    }, 1500);
  };

  useEffect(() => {
    // Initial demo trigger after 4 seconds
    const timer = setTimeout(() => {
      processAI({ dashboard: 2, reports: 3, settings: 1 }, 'reports');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-gray-100 flex font-sans overflow-hidden">
      
      {/* Sidebar - Glassmorphism */}
      <div className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Nexus AI</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {['dashboard', 'reports', 'settings'].map((item) => (
            <button
              key={item}
              onClick={() => trackAction(item)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 capitalize flex items-center justify-between group ${
                activeTab === item 
                ? 'bg-blue-600/10 border border-blue-500/50 text-blue-400' 
                : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              }`}
            >
              {item}
              {activeTab === item && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10 relative overflow-y-auto">
        
        {/* Top Navigation */}
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Adaptive Dashboard
            </h1>
            <p className="text-gray-500 mt-2">Machine learning active: UI is reconfiguring based on use.</p>
          </div>

          <button
            onClick={simulateVoice}
            className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded-full hover:bg-gray-200 transition-transform active:scale-95 shadow-lg shadow-white/5"
          >
            <span>🎤</span> Voice
          </button>
        </header>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {cards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8, borderColor: 'rgba(59, 130, 246, 0.3)' }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="p-8 bg-[#0f0f0f] border border-white/5 rounded-2xl group cursor-default"
              >
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em] mb-4 group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h2>
                <p className="text-4xl font-bold text-white mb-2">{card.value}</p>
                <div className="h-1 w-12 bg-blue-600 rounded-full opacity-50"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* AI Insight Notification */}
        <AnimatePresence>
          {suggestion && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-12 p-8 border border-blue-500/20 bg-[#0a0a0a] rounded-3xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] group-hover:bg-blue-600/10 transition-all"></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-2.5 py-1 bg-blue-500/10 rounded-md mb-4 inline-block border border-blue-500/20">
                    {suggestion.title}
                  </span>
                  <h3 className="text-2xl font-semibold text-white">{suggestion.desc}</h3>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSuggestion(null)}
                    className="text-gray-400 hover:text-white px-4 py-2 transition-colors"
                  >
                    Dismiss
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)]">
                    {suggestion.action}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Thinking Animation Overlay */}
        <AnimatePresence>
          {aiStatus === 'thinking' && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <p className="text-blue-400 font-mono tracking-widest animate-pulse">ANALYZING PATTERNS...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default App;