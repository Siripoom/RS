import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingForm = () => {
  const { roomId } = useParams(); // รับ roomId จาก URL
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลห้องจาก Supabase
  const fetchRoomDetails = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();
    if (error) {
      console.error("Error fetching room details:", error);
    } else {
      setRoom(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  // ฟังก์ชันการจองห้อง
  const handleBooking = async () => {
    if (!fullName || !phone || !email) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const bookingData = {
      room_id: room.id,
      full_name: fullName,
      phone,
      email,
      check_in: checkInDate,
      check_out: checkOutDate,
    };

    // บันทึกการจองห้องในฐานข้อมูล (ตาราง bookings)
    const { error } = await supabase.from("bookings").insert([bookingData]);
    if (error) {
      console.error("Error booking room:", error);
    } else {
      alert("การจองห้องพักสำเร็จ");
      navigate("/"); // กลับไปหน้าแรกหลังการจอง
    }
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูลห้องพัก...</p>;
  }

  return (
    <div>
      <h1>การจองห้องพัก</h1>
      <div className="room-details">
        <img src={room.image_url} alt={room.room_type} />
        <h2>{room.room_type}</h2>
        <p>ราคา: ฿{room.price}</p>
        <p>สถานะ: {room.status === "available" ? "ว่าง" : "ไม่ว่าง"}</p>

        {room.status === "available" ? (
          <>
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
              <label>เลือกวันที่เข้าพัก:</label>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => setCheckInDate(date)}
              />
            </div>

            <div>
              <label>เลือกวันที่ออก:</label>
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
              />
            </div>

            <button onClick={handleBooking}>จองห้องพัก</button>
          </>
        ) : (
          <p>ห้องนี้ไม่ว่างในขณะนี้</p>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
