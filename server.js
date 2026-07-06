const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Hardcoded for direct Hackathon compilation stability
const supabase = createClient(
  "https://your-actual-project-id.supabase.co", 
  "your-actual-long-sb-anon-key-here"
);

// Feature 1 Endpoint: Doubt Solver Proxy
app.post('/api/evaluate', async (req, res) => {
  try {
    const aiResponse = await axios.post('http://localhost:8000/api/ai/doubt-solver', req.body);
    res.json(aiResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Feature 2 Endpoint: Process Test Compilation and Pattern Analyzer
app.post('/api/test/finalize', async (req, res) => {
  const { sessionData, questionsContext } = req.body;
  try {
    // 1. Ask FastAPI + Gemini to perform cognitive diagnostics
    const aiAnalysis = await axios.post('http://localhost:8000/api/ai/pattern-analyzer', {
      questions_context: questionsContext
    });

    // 2. Commit transaction metadata directly into Supabase
    const { data, error } = await supabase
      .from('test_sessions')
      .insert([{
        subject: sessionData.subject,
        topics: sessionData.topics,
        total_questions: sessionData.totalQuestions,
        thinking_pattern_analysis: aiAnalysis.data.analysis
      }]);

    res.json({ success: true, evaluation: aiAnalysis.data.analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Node infrastructure listening on port ${PORT}`));
