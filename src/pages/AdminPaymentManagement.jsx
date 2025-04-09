import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AdminPaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPayment, setNewPayment] = useState({
    booking_id: "",
    full_name: "",
    status: "pending",
  });

  // ฟังก์ชันดึงข้อมูลการชำระเงินทั้งหมด
  const fetchPayments = async () => {
    const { data, error } = await supabase.from("payments").select("*");

    if (error) {
      console.error("Error fetching payments:", error);
    } else {
      setPayments(data);
    }
    setLoading(false);
  };

  // ฟังก์ชันเพิ่มการชำระเงินใหม่
  const addPayment = async () => {
    setLoading(true);
    const { error } = await supabase.from("payments").insert([newPayment]);

    if (error) {
      console.error("Error adding payment:", error);
    } else {
      alert("เพิ่มการชำระเงินใหม่เรียบร้อย");
      fetchPayments(); // รีเฟรชรายการการชำระเงิน
      setNewPayment({ booking_id: "", full_name: "", status: "pending" }); // รีเซ็ตฟอร์ม
    }
    setLoading(false);
  };

  // ฟังก์ชันยืนยันการชำระเงิน
  const confirmPayment = async (paymentId) => {
    const { error } = await supabase
      .from("payments")
      .update({ status: "completed" })
      .eq("id", paymentId);

    if (error) {
      console.error("Error confirming payment:", error);
    } else {
      alert("การชำระเงินได้รับการยืนยัน");
      fetchPayments(); // รีเฟรชรายการการชำระเงิน
    }
  };

  // ฟังก์ชันลบการชำระเงิน
  const deletePayment = async (paymentId) => {
    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", paymentId);
    if (error) {
      console.error("Error deleting payment:", error);
    } else {
      alert("การชำระเงินถูกลบเรียบร้อย");
      fetchPayments(); // รีเฟรชรายการการชำระเงิน
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return <p>กำลังโหลดประวัติการชำระเงิน...</p>;
  }

  return (
    <div>
      <h1>การจัดการการชำระเงิน</h1>

      {/* ฟอร์มการเพิ่มการชำระเงิน */}
      <h2>เพิ่มการชำระเงิน</h2>
      <div>
        <label>หมายเลขการจอง:</label>
        <input
          type="text"
          value={newPayment.booking_id}
          onChange={(e) =>
            setNewPayment({ ...newPayment, booking_id: e.target.value })
          }
        />
      </div>
      <div>
        <label>ชื่อผู้จอง:</label>
        <input
          type="text"
          value={newPayment.full_name}
          onChange={(e) =>
            setNewPayment({ ...newPayment, full_name: e.target.value })
          }
        />
      </div>
      <div>
        <label>สถานะการชำระเงิน:</label>
        <select
          value={newPayment.status}
          onChange={(e) =>
            setNewPayment({ ...newPayment, status: e.target.value })
          }
        >
          <option value="pending">รอการชำระเงิน</option>
          <option value="completed">ชำระเงินสำเร็จ</option>
        </select>
      </div>
      <button onClick={addPayment} disabled={loading}>
        {loading ? "กำลังเพิ่ม..." : "เพิ่มการชำระเงิน"}
      </button>

      {/* ตารางการชำระเงิน */}
      <h2>ประวัติการชำระเงิน</h2>
      <table>
        <thead>
          <tr>
            <th>หมายเลขการจอง</th>
            <th>ชื่อผู้จอง</th>
            <th>สถานะการชำระเงิน</th>
            <th>ยืนยันการชำระเงิน</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.booking_id}</td>
              <td>{payment.full_name}</td>
              <td>{payment.status}</td>
              <td>
                {payment.status === "pending" && (
                  <button onClick={() => confirmPayment(payment.id)}>
                    ยืนยัน
                  </button>
                )}
              </td>
              <td>
                <button onClick={() => deletePayment(payment.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPaymentManagement;
