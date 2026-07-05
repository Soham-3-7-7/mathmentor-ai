import React, { useState, useEffect } from 'react';

// Hardcoded boilerplate mock question data for hackathon presentation purposes
const MOCK_QUESTIONS = [
  { id: "q1", question: "A particle moves along a circular path of radius R. What is its displacement after half a circle?", options: ["2R", "πR", "Zero", "R/2"], correct: "2R" },
  { id: "q2", question: "Which of the following compounds has the highest covalent character according to Fajan's Rules?", options: ["LiCl", "NaCl", "KCl", "RbCl"], correct: "LiCl" }
];

export default function TestArena() {
  const [testActive, setTestActive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute countdown clock
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && testActive) {
      handleSubmitTest();
    }
  }, [timeLeft, testActive]);

  const handleStartTest = () => {
    setTestActive(true);
    setTimeLeft(60);
    setReport(null);
  };

  const handleSelectOption = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [MOCK_QUESTIONS[currentIdx].id]: option });
  };

  const handleSubmitTest = async () => {
    setTestActive(false);
    setLoading(true);

    // Formulate payload data matching expected backend array structure
    const testHistory = MOCK_QUESTIONS.map(q => ({
      question_id: q.id,
      selected_option: selectedAnswers[q.id] || "Skipped",
      correct_option: q.correct,
      time_taken_seconds: Math.floor(60 / MOCK_QUESTIONS.length) // Simplistic baseline simulation
    }));

    try {
      const res = await fetch('http://localhost:5000/api/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "hackathon_user_id", testHistory })
      });
      const data = await res.json();
      setReport(data.report);
    } catch (err) {
      alert("Error calculating metrics pipeline components.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans bg-slate-900 text-slate-100 rounded-xl min-h-[500px] mt-10 shadow-2xl">
      <h2 className="text-2xl font-black mb-4 text-cyan-400 tracking-tight">🔬 Feature 2: AI Adaptive Test Arena</h2>

      {!testActive && !report && (
        <button onClick={handleStartTest} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold py-3 px-6 rounded-lg hover:opacity-90">
          Start Dynamic Demo Test (Physics & Chemistry)
        </button>
      )}

      {testActive && (
        <div>
          <div className="flex justify-between font-mono bg-slate-950 p-3 rounded mb-4 text-sm">
            <span>Question {currentIdx + 1} of {MOCK_QUESTIONS.length}</span>
            <span className={timeLeft < 20 ? "text-red-400 animate-pulse" : "text-yellow-400"}>⏱️ Time Left: {timeLeft}s</span>
          </div>

          <p className="text-lg bg-slate-800 p-4 rounded-lg mb-6 border border-slate-700 font-medium">{MOCK_QUESTIONS[currentIdx].question}</p>
          
          <div className="space-y-3">
            {MOCK_QUESTIONS[currentIdx].options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-3 rounded-lg transition-all border ${selectedAnswers[MOCK_QUESTIONS[currentIdx].id] === opt ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)} className="px-4 py-2 bg-slate-700 rounded disabled:opacity-40">Previous</button>
            {currentIdx < MOCK_QUESTIONS.length - 1 ? (
              <button onClick={() => setCurrentIdx(currentIdx + 1)} className="px-4 py-2 bg-slate-700 rounded">Next</button>
            ) : (
              <button onClick={handleSubmitTest} className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded hover:opacity-90">Finish and Evaluate</button>
            )}
          </div>
        </div>
      )}

      {loading && <div className="text-center text-cyan-400 font-medium py-10 animate-pulse">Running Thinking Pattern Analysis Pipelines...</div>}

      {report && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mt-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-400 border-b border-slate-700 pb-2">🧠 Thinking Pattern Report</h3>
          <p className="text-sm text-slate-300 leading-relaxed italic">"{report.thinking_pattern_summary}"</p>
          
          <div>
            <h4 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-3">🧬 Learning DNA Metrics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg text-center border-t-4 border-blue-500">
                <span className="text-xs text-slate-400">Speed</span>
                <p className="text-2xl font-bold font-mono text-blue-400">{report.learning_dna.speed}%</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg text-center border-t-4 border-purple-500">
                <span className="text-xs text-slate-400">Logic</span>
                <p className="text-2xl font-bold font-mono text-purple-400">{report.learning_dna.logic}%</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg text-center border-t-4 border-emerald-500">
                <span className="text-xs text-slate-400">Calculation</span>
                <p className="text-2xl font-bold font-mono text-emerald-400">{report.learning_dna.calculation}%</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded text-xs text-slate-400 flex justify-between items-center">
            <span>Next Suggested Platform Adaptation:</span>
            <span className="font-bold text-yellow-400">{report.suggested_difficulty_adjustment}</span>
          </div>
        </div>
      )}
    </div>
  );
}
