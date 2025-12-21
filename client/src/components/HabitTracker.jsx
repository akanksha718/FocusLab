import { useState } from "react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const initialHabits = [
  {
    id: 1,
    name: "Wake up at 05:00",
    days: [true, true, true, true, true, false, false],
  },
  {
    id: 2,
    name: "No alcohol",
    days: [true, true, true, false, true, false, false],
  },
  {
    id: 3,
    name: "Cold shower",
    days: [true, true, false, false, true, false, false],
  },
  {
    id: 4,
    name: "1 hour on social media",
    days: [false, false, false, false, true, false, false],
  },
  {
    id: 5,
    name: "Gym",
    days: [true, true, true, true, false, false, false],
  },
];

const HabitTracker = () => {
  const [habits, setHabits] = useState(initialHabits);

  const toggleHabit = (habitIndex, dayIndex) => {
    const updated = [...habits];
    updated[habitIndex].days[dayIndex] =
      !updated[habitIndex].days[dayIndex];
    setHabits(updated);
  };

  const getProgress = (daysArr) => {
    const completed = daysArr.filter(Boolean).length;
    return Math.round((completed / 7) * 100);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      {/* Header */}
      <div className="bg-green-400 text-white text-center py-3 rounded-lg text-lg font-semibold">
        Habit Tracker
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 text-sm">
              <th className="text-left p-2">Habit</th>
              {days.map((day) => (
                <th key={day} className="p-2">
                  {day}
                </th>
              ))}
              <th className="p-2">Progress</th>
            </tr>
          </thead>

          <tbody>
            {habits.map((habit, hIndex) => (
              <tr
                key={habit.id}
                className="border-b hover:bg-gray-50"
              >
                {/* Habit Name */}
                <td className="p-2 font-medium">
                  {habit.name}
                </td>

                {/* Checkboxes */}
                {habit.days.map((checked, dIndex) => (
                  <td key={dIndex} className="text-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        toggleHabit(hIndex, dIndex)
                      }
                      className="w-4 h-4 accent-green-600 cursor-pointer"
                    />
                  </td>
                ))}

                {/* Progress Bar */}
                <td className="p-2">
                  <div className="w-28 bg-gray-200 h-2 rounded-full mx-auto">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${getProgress(habit.days)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-center mt-1">
                    {getProgress(habit.days)}%
                  </p>
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
