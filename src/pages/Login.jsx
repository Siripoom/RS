import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link , useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("Logged in as:", user);
      Swal.fire({
        title: "เข้าสู่ระบบสำเร็จ",
        text: "กรุณาเข้าสู่ระบบ",
        icon: "success",
      }).then(() => {
        navigate("/");
      });
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-amber-50">
      <div className=" rounded-3xl w-xl h-xl mx-60 p-10  bg-gray-100  shadow-lg" >
        <h2 className="text-2xl font-bold text-center mb-3">เข้าสู่ระบบ</h2>
        <div className="">
          <label htmlFor="email">อีเมล</label>
          <input
            type="email"
            placeholder="อีเมล"
            className="form-control w-full my-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="">
          <label htmlFor="password">รหัสผ่าน</label>
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control w-full my-2"
          />
        </div>
        <div className="">
          <button className="btn btn-success w-full my-2" onClick={handleLogin}>Login</button>
          {error && <p>{error}</p>}
        </div>
        <hr />
        <Link className="text-black text-center" to="/register">สมัครสมาชิก</Link>

      </div>
    </div>
  );
};

export default Login;
