import { FaChartBar, FaFileAlt } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
export default function AuthRight() {
  return (
    <div className="hidden md:flex w-1/2 bg-[#0f0f0f] items-center justify-center px-12">
      <div className="space-y-10">

        <h1 className="text-4xl font-bold mb-10">
          Welcome to <span className="text-orange-500">FocusLab</span>
        </h1>

        {/* Feature */}
        <Feature
          icon={<FaChartBar />}
          title="Track Your Goals"
          desc="Set and monitor your personal and professional goals daily/weekly/monthly."
        />

        <Feature
          icon={<FaFileAlt />}
          title="Get Organized"
          desc="Organize your tasks and todos efficiently to boost productivity."
        />

        <Feature
          icon={<IoIosNotifications />}
          title="Get Notified About Your Goals"
          desc="Receive timely notifications to stay on track with your objectives."
        />

      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex gap-5">
      <div className="bg-[#1a1a1a] p-4 rounded-xl text-orange-500 text-xl">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-400 text-sm">{desc}</p>
      </div>
    </div>
  );
}
