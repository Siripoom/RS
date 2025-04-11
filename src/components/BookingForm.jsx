import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import DatePicker from "react-datepicker";
import Dropdown from "../components/Dropdown";

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
    <div className="bg-gray-100 h-screen">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between px-5 ps-2 pe-5 py-auto bg-amber-300">
            <h3 className="font-bold text-center my-3">รายการห้องพัก</h3>
            <Dropdown label="สถานะ" />
          </div>
        </div>
      </div>
      <div className="container mt-3">
        <div className="d-flex justify-content-center">
          <div className="card w-full">
            <div className="card-body">
              <h1>การจองห้องพัก</h1>
              <div className=" row room-details">
                <div className="col-12 col-sm-12 col-md-6">
                  <img src={room.image_url} alt={room.room_type} />
                </div>
                <div className="col-12 col-sm-12 col-md-6">
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
                      <button className="btn btn-success form-control my-2" onClick={handleBooking}>จองห้องพัก</button>

                    </>
                  ) : (
                    <p>ห้องนี้ไม่ว่างในขณะนี้</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BookingForm;
