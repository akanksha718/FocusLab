import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    days: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false],
    },
    lastResetAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Habit', habitSchema);
