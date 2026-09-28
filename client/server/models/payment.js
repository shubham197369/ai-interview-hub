import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  email: { type: String, default: true },
  plan: { type: String, default: true },
  amount: { type: Number, default: true },
  utrNumber: { type: String, default: true, unique: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', PaymentSchema);