import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useLocation } from "react-router-dom"; // ใช้ useLocation แทน useParams
import Swal from "sweetalert2"; // ใช้ SweetAlert2 สำหรับการแจ้งเตือน
import Navbar from "./Navbar";
import slip from "../assets/133822.jpg"; // เปลี่ยนเป็น path ของสลิปการชำระเงิน

const PaymentForm = () => {
  const location = useLocation();
  const bookingId = location.state?.bookingId;
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันสำหรับอัปโหลดสลิปการชำระเงิน
  const handlePaymentSlipUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentSlip(file);
    }
  };
  const checkPaymentStatus = async (bookingId) => {
    const { data, error } = await supabase
      .from("payments")
      .select("status")
      .eq("booking_id", bookingId)
      .single(); // ดึงข้อมูลการชำระเงินของ booking เดียว

    if (error) {
      console.error("Error fetching payment status:", error);
    } else {
      setPaymentStatus(data.status); // ตั้งค่าค่าที่ดึงมา
    }
  };

  // ฟังก์ชันสำหรับการชำระเงิน
  const handlePayment = async () => {
    if (!fullName || !phone || !email || !paymentSlip) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนและอัปโหลดสลิป");
      return;
    }

    setLoading(true);

    // อัปโหลดสลิปการชำระเงินไปยัง Supabase Storage
    const { data, error } = await supabase.storage
      .from("payment-slips")
      .upload(`slips/${paymentSlip.name}`, paymentSlip);

    if (error) {
      console.error("Error uploading payment slip:", error);
      setLoading(false);
      return;
    }

    // บันทึกข้อมูลการชำระเงินในตาราง payments
    const { error: paymentError } = await supabase.from("payments").insert([
      {
        booking_id: bookingId,
        full_name: fullName,
        phone,
        email,
        payment_slip: data.path, // path ของไฟล์ที่อัปโหลด
        status: "pending", // ตั้งค่าเริ่มต้นเป็น "pending"
      },
    ]);

    if (paymentError) {
      console.error("Error saving payment data:", paymentError);
      setLoading(false);
      return;
    }


    alert("การชำระเงินของคุณได้รับการบันทึก");
    setLoading(false);
    setPaymentStatus("pending"); // อัปเดตสถานะการชำระเงิน
  };

  return (
    <div className="bg-gray-100 h-screen ">
      <Navbar userName={"Username"} />
      <div className="card mx-5 my-5">
        <div className="card-body px-5 py-5 ">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 d-flex justify-content-center">
              <img src={slip} width={"50%"} height={"50%"} alt="" />
            </div>
            <div className="col-12 col-sm-12 col-md-6">
            <h1>ชำระเงิน</h1>
          <div>
            <label>ชื่อเต็ม:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-control"
              placeholder="กรุณากรอกชื่อเต็ม"
              required
            />
          </div>

          <div>
            <label>เบอร์โทร:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
            />
          </div>

          <div>
            <label>อีเมล:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>

          <div>
            <label>อัปโหลดสลิปการชำระเงิน:</label>
            <input type="file" onChange={handlePaymentSlipUpload} className="form-control" />
          </div>

          <button onClick={handlePayment} className="btn btn-success my-4 form-control" disabled={loading}>
            {loading ? "กำลังอัปโหลด..." : "ชำระเงิน"}
          </button>

          {paymentStatus && <p>สถานะการชำระเงิน: {paymentStatus}</p>}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default PaymentForm;
