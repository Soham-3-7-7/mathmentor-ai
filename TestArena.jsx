import React, { useState } from 'react';

export default function TestArena() {
  const [activeTab, setActiveTab] = useState('doubt'); // 'doubt' or 'test'
  const [question, setQuestion] = useState('');
  const [userSolution, setUserSolution] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('// Logs will stream here...');
  const [loading, setLoading] = useState(false);

  const handleSolveDoubt = async () => {
    setLoading(true);
    setTerminalOutput('[PENDING] Sending question payloads to Node Orchestrator...');
    try {
      const res = await fetch('http://localhost:5000/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, student_solution: userSolution })
      });
      const data = await res.json();
      setTerminalOutput(data.analysis || JSON.stringify(data, null, 2));
    } catch (err) {
      setTerminalOutput(`[ERROR] Network drop detected: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100 p-6 flex flex-col items-center font-sans">
      
      {/* App Header */}
      <header className="w-full max-w-6xl text-center my-6">
        <div className="inline-block bg-indigo-500/10 text-indigo-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-500/20">
          Agentic AI Adaptive Learning Engine
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-slate-400 bg-clip-text text-transparent">
          MathMentor <span className="text-indigo-400">Agentic Suite</span>
        </h1>
      </header>

      {/* Feature Selector Tabs */}
      <div className="flex gap-4 mb-8 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
        <button 
          onClick={() => setActiveTab('doubt')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'doubt' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
        >
          🔍 Doubt Solver
        </button>
        <button 
          onClick={() => setActiveTab('test')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'test' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
        >
          📝 Adaptive Test Maker
        </button>
      </div>

      {/* Main Workspace Workspace */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Input Panel */}
        <main className="lg:col-span-5 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-2xl flex flex-col justify-between">
          {activeTab === 'doubt' ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-200"><span>💬</span> Physics & Math Doubt Room</h2>
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Enter Question Text</label>
                <textarea 
                  value={question} 
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Prove the reduction formula for integration of sin^n(x)..."
                  className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Your Attempted Steps (Optional)</label>
                <textarea 
                  value={userSolution}
                  onChange={(e) => setUserSolution(e.target.value)}
                  placeholder="Paste your code calculation steps or equations here..."
                  className="w-full h-28 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                />
              </div>
              <button 
                onClick={handleSolveDoubt}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing Agent Analytics...' : '🚀 Evaluate & Extract Corrections'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-200"><span>⚡</span> Setup Target Adaptive Test</h2>
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Target Examination Stream</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-300">
                  <option>JEE Mains / Advanced</option>
                  <option>NEET Medical Tracker</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Subject Scope</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-300">
                  <option>Mathematics (Integration, Calculus)</option>
                  <option>Physics (Mechanics, AC Circuits)</option>
                  <option>Chemistry</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Volume</label>
                  <input type="number" defaultValue={5} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-center text-slate-300" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Timer (Min)</label>
                  <input type="number" defaultValue={15} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-center text-slate-300" />
                </div>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl font-bold shadow-lg transition-all">
                🎯 Build Realtime Dynamic Test
              </button>
            </div>
          )}
        </main>

        {/* Right Output Dashboard Stream */}
        <section className="lg:col-span-7 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-2xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-300 flex items-center gap-2">
              <span>📊</span> AI Diagnostic Stream & Learning DNA
            </h3>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex-1 bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-xs overflow-y-auto text-indigo-300 whitespace-pre-wrap leading-relaxed">
            {terminalOutput}
          </div>
        </section>

      </div>
    </div>
  );
}
