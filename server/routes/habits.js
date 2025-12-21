import express from 'express';
import firebaseAuth from '../middleware/auth.js';
import User from '../models/User.js';
import Habit from '../models/Habit.js';

const router = express.Router();

// All routes require Firebase auth
router.use(firebaseAuth);

const startOfWeek = (d = new Date()) => {
  const dt = new Date(d);
  const day = dt.getDay(); // 0 (Sun) - 6 (Sat)
  dt.setHours(0, 0, 0, 0);
  dt.setDate(dt.getDate() - day);
  return dt;
};

// Get habits for current user (also reset weekly ticks if needed)
router.get('/', async (req, res) => {
  try {
    const fb = req.firebaseUser;
    const user = await User.findOne({ firebaseUid: fb.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const sow = startOfWeek(new Date());

    const habits = await Habit.find({ user: user._id }).sort({ createdAt: -1 });

    // Reset weekly ticks when lastResetAt is before start of this week
    const updates = [];
    for (const h of habits) {
      if (!h.lastResetAt || new Date(h.lastResetAt) < sow) {
        h.days = [false, false, false, false, false, false, false];
        h.lastResetAt = sow;
        updates.push(h.save());
      }
    }
    if (updates.length) await Promise.all(updates);

    const refreshed = await Habit.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ habits: refreshed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new habit
router.post('/', async (req, res) => {
  try {
    const { name, days } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const fb = req.firebaseUser;
    const user = await User.findOne({ firebaseUid: fb.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const habit = await Habit.create({
      user: user._id,
      name,
      days: Array.isArray(days) && days.length === 7 ? days : [false, false, false, false, false, false, false],
      lastResetAt: new Date(),
    });

    res.status(201).json({ habit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update habit (replace days or toggle specific day or update name)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, days, toggleDay } = req.body;

    const fb = req.firebaseUser;
    const user = await User.findOne({ firebaseUid: fb.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const habit = await Habit.findOne({ _id: id, user: user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    if (typeof name === 'string') habit.name = name;
    if (Array.isArray(days) && days.length === 7) habit.days = days;
    if (typeof toggleDay === 'number' && toggleDay >= 0 && toggleDay < 7) {
      habit.days[toggleDay] = !habit.days[toggleDay];
    }

    await habit.save();
    res.json({ habit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete habit
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fb = req.firebaseUser;
    const user = await User.findOne({ firebaseUid: fb.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const habit = await Habit.findOneAndDelete({ _id: id, user: user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
