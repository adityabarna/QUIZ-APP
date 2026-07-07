import express from 'express';
import cors from 'cors';
import { getDb, saveDb, getQuizzes, getQuizById, addQuiz, getLeaderboard, addLeaderboardEntry } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Quiz routes
app.get('/api/quizzes', (req, res) => {
  try {
    const quizzes = getQuizzes();
    // Return brief summary of quizzes (don't need full question details for listing if we want to save bandwidth, but for simplicity we return everything)
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve quizzes' });
  }
});

app.get('/api/quizzes/:id', (req, res) => {
  try {
    const quiz = getQuizById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve quiz details' });
  }
});

app.post('/api/quizzes', (req, res) => {
  try {
    const { title, description, category, difficulty, timeLimit, questions } = req.body;
    
    // Simple validation
    if (!title || !category || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Invalid quiz data. Title, category, and questions are required.' });
    }
    
    for (const q of questions) {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || !q.correctAnswer) {
        return res.status(400).json({ error: 'Each question must have text, at least two options, and a correct answer.' });
      }
    }
    
    const newQuiz = addQuiz({
      title,
      description: description || '',
      category,
      difficulty: difficulty || 'medium',
      timeLimit: Number(timeLimit) || 15,
      questions
    });
    
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

app.post('/api/quizzes/:id/questions', (req, res) => {
  try {
    const { question, options, correctAnswer, explanation } = req.body;
    
    // Validate question payload
    if (!question || !Array.isArray(options) || options.length < 2 || !correctAnswer) {
      return res.status(400).json({ error: 'Question text, options (at least 2), and a correct answer are required.' });
    }
    
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ error: 'The correctAnswer must exist in the options array.' });
    }

    const db = getDb();
    const quizIdx = db.quizzes.findIndex(q => q.id === req.params.id);
    
    if (quizIdx === -1) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const newQuestion = {
      id: `q_${Date.now()}_${db.quizzes[quizIdx].questions.length}`,
      question,
      options,
      correctAnswer,
      explanation: explanation || ''
    };

    db.quizzes[quizIdx].questions.push(newQuestion);
    saveDb(db);

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Failed to add question to quiz' });
  }
});

// Leaderboard routes
app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve leaderboard' });
  }
});

app.post('/api/leaderboard', (req, res) => {
  try {
    const { username, quizTitle, score, totalQuestions } = req.body;
    
    if (!username || !quizTitle || score === undefined || totalQuestions === undefined) {
      return res.status(400).json({ error: 'username, quizTitle, score, and totalQuestions are required' });
    }
    
    const newEntry = addLeaderboardEntry({
      username,
      quizTitle,
      score,
      totalQuestions
    });
    
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add leaderboard score' });
  }
});

app.listen(PORT, () => {
  console.log(`Quiz API Server running on http://localhost:${PORT}`);
});
