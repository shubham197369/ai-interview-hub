/* eslint-disable no-undef */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Payment from './models/payment.js';
import User from './models/User.js';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const groqApiKey = (process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || '').trim();
const hasValidGroqKey = !!groqApiKey &&
  !groqApiKey.includes('PASTE_') &&
  !groqApiKey.includes('INVALID_') &&
  groqApiKey.length > 20;

if (!groqApiKey) {
  console.warn('Groq API key missing. Set GROQ_API_KEY in client/.env');
} else if (!hasValidGroqKey) {
  console.warn('Groq API key looks incomplete or placeholder. Paste the exact key.');
}

const callGroqChat = async (prompt) => {
  if (!hasValidGroqKey || !groqApiKey) {
    throw new Error('Groq API key is missing or invalid in backend .env file.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant', // Highly reliable & fast model for Groq
      messages: [
        { role: 'system', content: 'You are an expert AI Career Coach and technical interviewer. Provide precise, professional, and practical guidance in a friendly tone.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || 'Groq request failed.';
    throw new Error(message);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Empty Groq response.');
  }

  return text;
};

const parseGroqJson = (text) => {
  if (!text) throw new Error('Empty Groq response');

  let cleaned = String(text).trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }

  return JSON.parse(cleaned);
};

const createHeuristicReport = (completedAnswers = []) => {
  const validAnswers = completedAnswers.filter((item) => {
    const answer = (item?.userAnswer || '').trim();
    return answer.length > 25 && !/^(asdf|qwer|test|hello|hi|ok|yes|no)$/i.test(answer);
  }).length;

  const totalAnswers = Math.max(1, completedAnswers.length || 1);
  const baseScore = Math.min(100, Math.max(12, Math.round((validAnswers / totalAnswers) * 100)));

  return {
    score: baseScore,
    confidenceLevel: baseScore >= 80 ? 'Intermediate' : baseScore >= 50 ? 'Needs Practice' : 'Beginner',
    strengths: validAnswers > 0 ? 'Candidate provided structured technical responses with relevant domain keywords.' : 'No meaningful technical content detected.',
    areasOfImprovement: validAnswers > 0
      ? 'Give more concrete examples, technical depth, and exact trade-offs to improve your evaluation score.'
      : 'Write detailed, relevant answers with real examples and technical reasoning.'
  };
};

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'AI backend is running.' });
});

// MongoDB Database Connection
mongoose.connect('mongodb://localhost:27017/ai-interview-hub')
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.log('DB Connection Error:', err));

// Ensure uploads directory exists automatically
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup for PDF only
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF resumes are supported!'), false);
    }
  }
});

// 1. Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "Signup successful!", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Upload Resume API
app.post('/api/user/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    const { email } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a valid PDF resume.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found!' });

    user.resumePath = req.file.path;
    user.resumeOriginalName = req.file.originalname;
    await user.save();

    res.status(200).json({ 
      message: 'Resume uploaded successfully! Now AI is analyzing your profile...',
      fileName: req.file.originalname 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading resume.' });
  }
});

// 3. AI Chat & Guidance API
const handleAIChatLogic = async (req, res) => {
  try {
    const { message } = req.body;
    const safeMessage = typeof message === 'string' ? message.trim() : (req.body.prompt || '');

    if (!safeMessage) {
      return res.status(400).json({ message: 'Message cannot be empty.' });
    }

    const aiReply = await callGroqChat(safeMessage);

    res.status(200).json({ 
      success: true, 
      reply: aiReply, 
      message: aiReply
    });
  } catch (err) {
    console.error('Groq API Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error connecting to Groq AI neural engine.'
    });
  }
};

app.post('/api/ai/evaluate', async (req, res) => {
  try {
    const { domainTitle = 'Full-Stack Engineering', answers = [] } = req.body || {};
    const completedAnswers = Array.isArray(answers) ? answers : [];

    const prompt = `You are an extremely strict technical interviewer for ${domainTitle}. 
      Evaluate the candidate's answers below critically. If the answers are blank, gibberish, random letters, or completely irrelevant, give them a low score between 0 to 15.
      
      Questions and Candidate Answers:
      ${completedAnswers.map((item, idx) => `Q${idx + 1}: ${item.question}\nAns:${item.userAnswer || 'No answer provided'}`).join('\n\n')}

      Provide a strict JSON response containing:
      - score: A number from 0 to 100 based strictly on technical correctness.
      - confidenceLevel: A rating string (e.g., "Beginner", "Needs Practice", "Intermediate", "Elite Pro").
      - strengths: Honest feedback on what was correct.
      - areasOfImprovement: Detailed critique on why answers were weak or incorrect.
      
      Return ONLY valid JSON format without markdown ticks, structured like:
      {
        "score": 10,
        "confidenceLevel": "Beginner",
        "strengths": "...",
        "areasOfImprovement": "..."
      }`;

    if (!hasValidGroqKey || !groqApiKey) {
      return res.status(200).json({
        success: true,
        fallback: true,
        report: createHeuristicReport(completedAnswers)
      });
    }

    const aiText = await callGroqChat(prompt);
    let report = createHeuristicReport(completedAnswers);

    try {
      report = parseGroqJson(aiText);
    } catch (parseErr) {
      console.warn('Groq JSON parse failed, using heuristic fallback:', parseErr.message);
    }

    return res.status(200).json({
      success: true,
      fallback: false,
      report
    });
  } catch (err) {
    console.error('Interview evaluation failed:', err);
    return res.status(200).json({
      success: true,
      fallback: true,
      report: createHeuristicReport(req.body?.answers || [])
    });
  }
});

app.post('/api/user/ai-chat', handleAIChatLogic);
app.post('/api/ai/chat', handleAIChatLogic);

// 4. Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Payment Submit API
app.post('/api/payment/submit', async (req, res) => {
  try {
    const { email, plan, amount, utrNumber } = req.body;

    const existingPayment = await Payment.findOne({ utrNumber });
    if (existingPayment) {
      return res.status(400).json({ message: 'Yeh UTR number pehle hi submit kiya ja chuka hai!' });
    }

    const newPayment = new Payment({
      email,
      plan,
      amount,
      utrNumber,
      status: 'Pending'
    });

    await newPayment.save();
    res.status(200).json({ message: 'Payment request successfully submitted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error, kripya baad me try karein.' });
  }
});

// 6. Admin Payments Get API
app.get('/api/admin/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

// 7. Admin Approve API
app.put('/api/admin/payment/approve/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findByIdAndUpdate(
      paymentId, 
      { status: 'Approved' }, 
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment record nahi mila!' });
    }

    try {
      await User.findOneAndUpdate(
        { email: payment.email },
        { isPro: true }
      );
    } catch (userErr) {
      console.log('User model update warning:', userErr.message);
    }

    res.status(200).json({ message: 'Payment approved & Pro access granted!', payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error approving payment' });
  }
});

// 8. Change Password API
app.put('/api/user/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User nahi mila!' });

    if (user.password && user.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password galat hai!' });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating password' });
  }
});

// 9. Admin Get All Users API
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// 10. App Suggestion & Pack Booster API
app.post('/api/user/suggest-app', async (req, res) => {
  try {
    const { email, suggestion } = req.body;
    const targetEmail = email || 'shubham@example.com';
    
    let user = await User.findOne({ email: targetEmail });
    
    if (!user) {
      user = new User({
        name: 'Shubham G Ravale',
        email: targetEmail,
        password: '123',
        daysRemaining: 0,
        isPro: false,
        suggestionHistory: []
      });
      await user.save();
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    
    if (!user.suggestionHistory) {
      user.suggestionHistory = [];
    }

    const thisMonthSuggestions = user.suggestionHistory.filter(item => new Date(item.date).getMonth() === currentMonth);

    if (thisMonthSuggestions.length >= 2) {
      return res.status(400).json({ message: 'Aap is mahine ke apne 2 suggestions limit poori kar chuke hain!' });
    }

    const extensionDays = thisMonthSuggestions.length === 0 ? 3 : 6;

    user.suggestionHistory.push({ text: suggestion, date: now });
    user.daysRemaining = (user.daysRemaining || 0) + extensionDays;
    user.isPro = true; 
    await user.save();

    res.status(200).json({ 
      message: `Suggestion submitted successfully! Aapka pack ${extensionDays} din ke liye extend kar diya gaya hai. 🎉`,
      updatedUser: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error processing suggestion.' });
  }
});

// 11. Admin Get All Suggestions API
app.get('/api/admin/suggestions', async (req, res) => {
  try {
    const users = await User.find({ "suggestionHistory.0": { $exists: true } }).select('email name suggestionHistory');
    
    let allSuggestions = [];
    users.forEach(u => {
      if (u.suggestionHistory) {
        u.suggestionHistory.forEach(s => {
          allSuggestions.push({
            email: u.email,
            name: u.name || 'User',
            text: s.text,
            date: s.date
          });
        });
      }
    });

    res.status(200).json(allSuggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching suggestions' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});