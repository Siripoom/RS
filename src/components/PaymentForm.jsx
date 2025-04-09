import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const PaymentForm = ({ bookingId }) => {
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
    <div>
      <h1>ฟอร์มการชำระเงิน</h1>
      <div>
        <label>ชื่อเต็ม:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div>
        <label>เบอร์โทร:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <label>อีเมล:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>อัปโหลดสลิปการชำระเงิน:</label>
        <input type="file" onChange={handlePaymentSlipUpload} />
      </div>

      <button onClick={handlePayment} disabled={loading}>
        {loading ? "กำลังอัปโหลด..." : "ชำระเงิน"}
      </button>

      {paymentStatus && <p>สถานะการชำระเงิน: {paymentStatus}</p>}
    </div>
  );
};

export default PaymentForm;
