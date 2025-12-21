import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const API = import.meta.env.VITE_API || 'http://localhost:3000';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchHabits(u);
      else {
        setHabits([]);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const getTokenHeader = async (u) => {
    const token = await u.getIdToken();
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchHabits = async (u) => {
    try {
      setLoading(true);
      const cfg = await getTokenHeader(u);
      const res = await axios.get(`${API}/habits`, cfg);
      setHabits(res.data.habits || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim() || !user) return;
    try {
      const cfg = await getTokenHeader(user);
      const res = await axios.post(`${API}/habits`, { name: newHabit.trim() }, cfg);
      setHabits((s) => [res.data.habit, ...s]);
      setNewHabit('');
    } catch (err) {
      console.error(err);
      alert('Failed to add habit');
    }
  };

  const toggleDay = async (habitId, dayIndex) => {
    if (!user) return;
    try {
      const cfg = await getTokenHeader(user);
      const res = await axios.put(`${API}/habits/${habitId}`, { toggleDay: dayIndex }, cfg);
      setHabits((s) => s.map((h) => (h._id === habitId ? res.data.habit : h)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHabit = async (habitId) => {
    if (!user) return;
    try {
      const cfg = await getTokenHeader(user);
      await axios.delete(`${API}/habits/${habitId}`, cfg);
      setHabits((s) => s.filter((h) => h._id !== habitId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  const getProgress = (daysArr) => {
    const completed = (daysArr || []).filter(Boolean).length;
    return Math.round((completed / 7) * 100);
  };

  if (loading) return (
    <div className="bg-white p-6 rounded-xl shadow-lg">Loading...</div>
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center">
          <div className="bg-green-400 text-white py-2 px-4 rounded-lg text-lg font-semibold">Track habits Daily</div>
        </div>

        <form onSubmit={addHabit} className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add habit"
            className="px-3 py-2 border rounded-lg w-full sm:w-56"
          />
          <button className="bg-green-600 text-white px-3 py-2 rounded-lg w-full sm:w-auto">Add</button>
        </form>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {habits.map((habit) => (
          <div key={habit._id} className="border rounded-lg p-3 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-sm">{habit.name}</div>
              <button onClick={() => deleteHabit(habit._id)} className="text-red-600 text-sm">Delete</button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {((habit.days) || [false, false, false, false, false, false, false]).map((checked, dIndex) => (
                <label key={dIndex} className="flex flex-col items-center text-xs min-w-[44px]">
                  <input type="checkbox" checked={!!checked} onChange={() => toggleDay(habit._id, dIndex)} className="w-4 h-4 accent-green-600" />
                  <span className="mt-1">{days[dIndex]}</span>
                </label>
              ))}
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${getProgress(habit.days)}%` }} />
              </div>
              <p className="text-xs text-right mt-1">{getProgress(habit.days)}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table for md+ screens */}
      <div className="hidden sm:block overflow-x-auto mt-2">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 text-sm">
              <th className="text-left p-2">Habit</th>
              {days.map((day) => (
                <th key={day} className="p-2">{day}</th>
              ))}
              <th className="p-2">Progress</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {habits.map((habit) => (
              <tr key={habit._id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{habit.name}</td>
                {(habit.days || [false, false, false, false, false, false, false]).map((checked, dIndex) => (
                  <td key={dIndex} className="text-center">
                    <input type="checkbox" checked={!!checked} onChange={() => toggleDay(habit._id, dIndex)} className="w-4 h-4 accent-green-600 cursor-pointer" />
                  </td>
                ))}
                <td className="p-2">
                  <div className="w-28 bg-gray-200 h-2 rounded-full mx-auto">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${getProgress(habit.days)}%` }} />
                  </div>
                  <p className="text-xs text-center mt-1">{getProgress(habit.days)}%</p>
                </td>
                <td className="p-2 text-center">
                  <button onClick={() => deleteHabit(habit._id)} className="text-sm text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitTracker;
