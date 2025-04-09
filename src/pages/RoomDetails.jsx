import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RoomDetails = () => {
  const { roomId } = useParams(); // รับ roomId จาก URL
  const [room, setRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลห้องพักจาก Supabase ตาม roomId
  const fetchRoomDetails = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single(); // ใช้ single เพื่อดึงแค่ 1 ห้อง
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

  if (loading) {
    return <p>กำลังโหลดข้อมูลห้องพัก...</p>;
  }

  return (
    <div>
      <h1>รายละเอียดห้องพัก</h1>
      <div className="room-details">
        <img src={room.image_url} alt={room.room_type} />
        <h2>{room.room_type}</h2>
        <p>ขนาด: {room.size} ตร.ม.</p>
        <p>ราคา: ฿{room.price}</p>
        <p>สถานะ: {room.status === "available" ? "ว่าง" : "ไม่ว่าง"}</p>

        {room.status === "available" ? (
          <>
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

            <button onClick={() => alert("จองห้องพัก")}>จองห้องพัก</button>
          </>
        ) : (
          <p>ห้องนี้ไม่ว่างในขณะนี้</p>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
