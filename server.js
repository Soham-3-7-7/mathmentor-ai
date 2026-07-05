const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const FASTAPI_URL = "http://localhost:8000";

// Route: Save Test results and invoke the Python AI Analyzer
app.post('/api/tests/submit', async (req, res) => {
  const { userId, testHistory } = req.body;

  try {
    // 1. Pass the test data forward to your Python FastAPI service
    const aiResponse = await axios.post(`${FASTAPI_URL}/api/analyze-test`, {
      test_history: testHistory
    });
    
    // Parse the structured JSON content returned from Gemini via FastAPI
    const diagnosticResult = typeof aiResponse.data === 'string' ? JSON.parse(aiResponse.data) : aiResponse.data;

    // 2. Persist the analysis records into your Supabase database instance
    const { data, error } = await supabase
      .from('test_analytics')
      .insert([
        { 
          user_id: userId, 
          learning_dna_speed: diagnosticResult.learning_dna.speed,
          learning_dna_logic: diagnosticResult.learning_dna.logic,
          learning_dna_calculation: diagnosticResult.learning_dna.calculation,
          summary: diagnosticResult.thinking_pattern_summary,
          difficulty_next: diagnosticResult.suggested_difficulty_adjustment,
          created_at: new Date()
        }
      ]);

    if (error) throw error;

    res.json({ message: "Analysis completed successfully", report: diagnosticResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed processing metrics pipeline" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Node infrastructure listening on port ${PORT}`));
