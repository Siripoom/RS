import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ดึงข้อมูลห้องพักจาก Supabase
  const fetchRooms = async () => {
    const { data, error } = await supabase.from("rooms").select("*");
    if (error) {
      console.error("Error fetching rooms:", error);
    } else {
      setRooms(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleBooking = (roomId) => {
    // เปลี่ยนเส้นทางไปยังหน้าจองห้องพักโดยใช้ `roomId`
    navigate(`/book-room/${roomId}`);
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูลห้องพัก...</p>;
  }

  return (
    <div>
      <h1>รายการห้องพัก</h1>
      <div className="room-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <img
              src={room.image_url || "default-room-image.jpg"}
              alt={room.room_type}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <h2>{room.room_type}</h2>
            <p>ขนาด: {room.size} ตร.ม.</p>
            <p>ราคาเริ่มต้น: ฿{room.price}</p>
            <p>สถานะ: {room.status === "available" ? "ว่าง" : "ไม่ว่าง"}</p>
            {room.status === "available" ? (
              <button onClick={() => handleBooking(room.id)}>จองห้อง</button>
            ) : (
              <p>ห้องนี้ไม่ว่าง</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
