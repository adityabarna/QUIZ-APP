import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure database file and directories exist
function ensureDbExists() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(DB_FILE)) {
    const initialData = { quizzes: [], leaderboard: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

export function getDb() {
  ensureDbExists();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file, returning default structure:', error);
    return { quizzes: [], leaderboard: [] };
  }
}

export function saveDb(data) {
  ensureDbExists();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
}

export function getQuizzes() {
  const db = getDb();
  return db.quizzes || [];
}

export function getQuizById(id) {
  const quizzes = getQuizzes();
  return quizzes.find(q => q.id === id);
}

export function addQuiz(quiz) {
  const db = getDb();
  const newQuiz = {
    id: `custom_${Date.now()}`,
    ...quiz,
    questions: quiz.questions.map((q, idx) => ({
      id: `q_${Date.now()}_${idx}`,
      ...q
    }))
  };
  
  db.quizzes = db.quizzes || [];
  db.quizzes.push(newQuiz);
  saveDb(db);
  return newQuiz;
}

export function getLeaderboard() {
  const db = getDb();
  const list = db.leaderboard || [];
  // Sort by percentage descending, then by score descending, then by date descending
  return list.sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.date) - new Date(a.date);
  });
}

export function addLeaderboardEntry(entry) {
  const db = getDb();
  const newEntry = {
    id: `lb_${Date.now()}`,
    username: entry.username || 'Anonymous',
    quizTitle: entry.quizTitle || 'Unknown Quiz',
    score: Number(entry.score) || 0,
    totalQuestions: Number(entry.totalQuestions) || 0,
    percentage: Math.round((Number(entry.score) / Number(entry.totalQuestions)) * 100) || 0,
    date: new Date().toISOString()
  };
  
  db.leaderboard = db.leaderboard || [];
  db.leaderboard.push(newEntry);
  saveDb(db);
  return newEntry;
}
