import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link , useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error:", error); // ตรวจสอบข้อผิดพลาด
      setError(error.message);
    } else {
      console.log("User registered:", user); // ตรวจสอบข้อมูลผู้ใช้
      Swal.fire({
        title: "สมัครสมาชิกสำเร็จ",
        text: "กรุณาเข้าสู่ระบบ",
        icon: "success",
      }).then(() => {
        navigate("/login");
      });
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-amber-50">
      <div className=" rounded-3xl w-xl h-xl mx-60 p-10  bg-gray-100  shadow-lg" >
        <h2 className="text-2xl font-bold text-center mb-3">สมัครสมาชิก</h2>
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
            className="form-control w-full my-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="">
          <button onClick={handleRegister} className="btn btn-success w-full my-2">Register</button>
          {error && <p>{error}</p>}
        </div>
        <hr />
        <Link className="text-black text-center" to="/login">กลับหน้าเข้าสู่ระบบ</Link>
      </div>

    </div>
  );
};

export default Register;
