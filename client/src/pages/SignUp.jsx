import AuthRight from "../components/common/RightSide";
import LeftSignup from "../components/LeftSignup";

export default function Signup({ setUser, setLoading }) {
  return (
    <div className="min-h-screen flex bg-[#0b0b0b] text-white">
      <LeftSignup setUser={setUser} setLoading={setLoading} />
      <AuthRight />
    </div>
  );
}

