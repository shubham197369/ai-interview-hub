import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPro: { type: Boolean, default: false },
  daysRemaining: { type: Number, default: 0 },
  suggestionHistory: [
    {
      text: { type: String },
      date: { type: Date, default: Date.now }
    }
  ],
  // Naye fields jo resume upload aur AI chatbot ke liye zaroori hain:
  resumePath: { type: String, default: '' },
  resumeOriginalName: { type: String, default: '' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;