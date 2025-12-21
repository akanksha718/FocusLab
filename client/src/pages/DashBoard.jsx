import HabitTracker from '../components/HabitTracker'
import Header from '../components/Header'


const DashBoard = () => {
  return (
    <div className='bg-gray-800 min-h-screen '>
      <Header />
      <HabitTracker/>
    </div>
  )
}

export default DashBoard
