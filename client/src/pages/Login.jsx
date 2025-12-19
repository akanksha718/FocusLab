import AuthRight from "../components/common/RightSide"
import AuthLeft from "../components/LeftSignin"


const Login = ({setUser , setLoading}) => {
  return (
    <div className="min-h-screen flex bg-[#0b0b0b] text-white">
      <AuthLeft setUser={setUser} setLoading={setLoading} />
      <AuthRight />
    </div>
  )
}

export default Login
