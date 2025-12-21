import HabitTracker from '../components/HabitTracker'
import Header from '../components/Header'
import StickyNote from '../components/StickyNote'
import WeeklyPlanner from '../components/WeeklyPlanner'


const DashBoard = () => {
  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Top row: HabitTracker (2/3) and StickyNote (1/3) on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <HabitTracker />
            </div>
            <div className="md:col-span-1">
              <StickyNote />
            </div>
          </div>

          {/* Full-width weekly planner below */}
          <div>
            <WeeklyPlanner />
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashBoard
