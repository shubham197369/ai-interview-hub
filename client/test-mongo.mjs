import mongoose from 'mongoose';

try {
  await mongoose.connect('mongodb://localhost:27017/ai-interview-hub', { serverSelectionTimeoutMS: 3000 });
  console.log('MONGO CONNECTED SUCCESSFULLY');
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  await mongoose.disconnect();
} catch (e) {
  console.log('MONGO CONNECTION FAILED:', e.message);
}
