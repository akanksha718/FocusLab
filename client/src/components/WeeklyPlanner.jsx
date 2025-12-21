import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';
import StickyNote from './StickyNote';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const API = import.meta.env.VITE_API || 'http://localhost:3000';

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function WeeklyPlanner() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [todosByDay, setTodosByDay] = useState({});
  const [notesByDay, setNotesByDay] = useState({});
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // load local storage for this week
    const uid = user?.uid || 'guest';
    const key = `focuslab_week_${uid}_${formatDate(weekStart)}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setTodosByDay(parsed.todos || {});
        setNotesByDay(parsed.notes || {});
      } else {
        // initialize empty structure for the 7 days
        const tmpTodos = {};
        const tmpNotes = {};
        for (let i = 0; i < 7; i++) {
          const d = new Date(weekStart);
          d.setDate(d.getDate() + i);
          tmpTodos[formatDate(d)] = [];
          tmpNotes[formatDate(d)] = '';
        }
        setTodosByDay(tmpTodos);
        setNotesByDay(tmpNotes);
      }
    } catch (err) {
      console.error(err);
    }
  }, [user, weekStart]);

  useEffect(() => {
    // fetch habits (used to compute progress along with todos)
    const fetchHabits = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const cfg = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API}/habits`, cfg);
        setHabits(res.data.habits || []);
      } catch (err) {
        console.error('failed loading habits', err);
      }
    };
    if (user) fetchHabits();
  }, [user]);

  useEffect(() => {
    // persist when todos/notes change
    const uid = user?.uid || 'guest';
    const key = `focuslab_week_${uid}_${formatDate(weekStart)}`;
    const payload = { todos: todosByDay, notes: notesByDay };
    try {
      localStorage.setItem(key, JSON.stringify(payload));
    } catch (err) {
      console.error(err);
    }
  }, [todosByDay, notesByDay, user, weekStart]);

  const addTodo = (dateKey, text) => {
    if (!text || !text.trim()) return;
    setTodosByDay((s) => {
      const copy = { ...s };
      const list = copy[dateKey] ? [...copy[dateKey]] : [];
      list.push({ id: Date.now(), text: text.trim(), done: false });
      copy[dateKey] = list;
      return copy;
    });
  };

  const toggleTodo = (dateKey, id) => {
    setTodosByDay((s) => {
      const copy = { ...s };
      copy[dateKey] = (copy[dateKey] || []).map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      return copy;
    });
  };

  const deleteTodo = (dateKey, id) => {
    setTodosByDay((s) => {
      const copy = { ...s };
      copy[dateKey] = (copy[dateKey] || []).filter((t) => t.id !== id);
      return copy;
    });
  };

  const updateNote = (dateKey, text) => {
    setNotesByDay((s) => ({ ...s, [dateKey]: text }));
  };

  const computePercentForDay = (dateKey, dayIndex) => {
    const todos = todosByDay[dateKey] || [];
    const totalTodos = todos.length;
    const doneTodos = todos.filter((t) => t.done).length;

    const totalHabits = habits.length;
    const doneHabits = habits.filter((h) => (h.days || [])[dayIndex]).length;

    const denom = totalTodos + totalHabits;
    if (!denom) return 0;
    return Math.round(((doneTodos + doneHabits) / denom) * 100);
  };

  const renderDayCard = (i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const key = formatDate(d);
    const percent = computePercentForDay(key, i);

    return (
      <div key={key} className="border rounded-lg p-3 bg-white shadow-sm flex flex-col h-auto md:h-72">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">{days[d.getDay()]}, {d.toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">{percent}% completed</div>
          </div>
          <div className="w-16 h-16 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-green-700">{percent}%</div>
          </div>
        </div>

        <div className="mt-3 flex-1 flex flex-col min-h-0">
          <div className="text-xs font-medium mb-1">Todos</div>
          <div className="flex-1 overflow-y-auto space-y-2 mb-2 min-h-0">
            {(todosByDay[key] || []).map((t) => (
              <div key={t.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!t.done} onChange={() => toggleTodo(key, t.id)} className="w-4 h-4 accent-green-600" />
                  <span className={t.done ? 'line-through text-gray-400 text-sm' : 'text-sm'}>{t.text}</span>
                </label>
                <button onClick={() => deleteTodo(key, t.id)} className="text-red-500 text-xs">Del</button>
              </div>
            ))}
          </div>

          <div className="mt-2">
            <AddTodoForm onAdd={(text) => addTodo(key, text)} />
          </div>

          {/* <div className="mt-3">
            <div className="text-xs font-medium mb-1">Sticky Note</div>
            <StickyNote value={notesByDay[key] || ''} onChange={(v) => updateNote(key, v)} />
          </div> */}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Weekly Planner</h2>
        <div className="text-sm text-gray-500">Week of {formatDate(weekStart)}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 7 }).map((_, i) => renderDayCard(i))}
      </div>
    </div>
  );
}

function AddTodoForm({ onAdd }) {
  const [val, setVal] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(val);
        setVal('');
      }}
      className="flex gap-2 items-center"
    >
      <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Add todo" className="flex-1 min-w-0 px-2 py-1 border rounded text-sm" />
      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded text-sm flex-shrink-0">Add</button>
    </form>
  );
}
