import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  plan: { type: String, required: true },
  amount: { type: Number, required: true },
  utrNumber: { type: String, required: true, unique: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', PaymentSchema);