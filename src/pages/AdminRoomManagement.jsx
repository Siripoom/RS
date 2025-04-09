import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AdminRoomManagement = () => {
  const [roomType, setRoomType] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("available");
  const [roomImage, setRoomImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);

  // ฟังก์ชันอัปโหลดรูปภาพ
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setRoomImage(file);
  };

  // ฟังก์ชันเพิ่มห้อง
  const addRoom = async () => {
    setLoading(true);

    // อัปโหลดรูปภาพไปยัง Supabase Storage
    let imageUrl = "";
    if (roomImage) {
      const { data, error: uploadError } = await supabase.storage
        .from("room-images")
        .upload(`rooms/${roomImage.name}`, roomImage);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        setLoading(false);
        return;
      }

      imageUrl = data?.path;
    }

    // เพิ่มห้องในตาราง rooms
    const { data, error } = await supabase.from("rooms").insert([
      {
        room_type: roomType,
        size,
        price,
        status,
        image_url: imageUrl
          ? `https://cncsyhhlnwlrmlghwjbb.supabase.co/storage/v1/object/public/room-images/${imageUrl}`
          : "", // URL ของรูปภาพ
      },
    ]);

    if (error) {
      console.error("Error adding room:", error);
    } else {
      alert("ห้องพักถูกเพิ่มเรียบร้อย");
      fetchRooms(); // รีเฟรชรายการห้อง
    }
    setLoading(false);
  };

  // ฟังก์ชันดึงข้อมูลห้องทั้งหมด
  const fetchRooms = async () => {
    const { data, error } = await supabase.from("rooms").select("*");
    if (error) {
      console.error("Error fetching rooms:", error);
    } else {
      setRooms(data);
    }
  };

  // ฟังก์ชันลบห้อง
  const deleteRoom = async (roomId) => {
    const { error } = await supabase.from("rooms").delete().eq("id", roomId);
    if (error) {
      console.error("Error deleting room:", error);
    } else {
      alert("ห้องถูกลบเรียบร้อย");
      fetchRooms(); // รีเฟรชรายการห้อง
    }
  };

  // ฟังก์ชันแก้ไขห้อง
  const editRoom = async (roomId) => {
    const newPrice = prompt("กรอกราคาใหม่:");
    if (newPrice) {
      const { error } = await supabase
        .from("rooms")
        .update({ price: newPrice })
        .eq("id", roomId);
      if (error) {
        console.error("Error updating room:", error);
      } else {
        alert("ห้องถูกแก้ไขเรียบร้อย");
        fetchRooms(); // รีเฟรชรายการห้อง
      }
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div>
      <h1>เพิ่มห้องพัก</h1>
      <div>
        <label>ประเภทห้อง:</label>
        <input
          type="text"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
        />
      </div>
      <div>
        <label>ขนาดห้อง (ตร.ม.):</label>
        <input
          type="text"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </div>
      <div>
        <label>ราคา:</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label>สถานะห้อง:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="available">ว่าง</option>
          <option value="unavailable">ไม่ว่าง</option>
        </select>
      </div>
      <div>
        <label>อัปโหลดรูปห้อง:</label>
        <input type="file" onChange={handleImageUpload} />
      </div>
      <button onClick={addRoom} disabled={loading}>
        {loading ? "กำลังเพิ่มห้อง..." : "เพิ่มห้องพัก"}
      </button>

      <h2>รายการห้องพัก</h2>
      <div>
        {rooms.length > 0 ? (
          <ul>
            {rooms.map((room) => (
              <li key={room.id}>
                <img
                  src={room.image_url || "default-room-image.jpg"}
                  alt={room.room_type}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <p>ประเภทห้อง: {room.room_type}</p>
                <p>ขนาด: {room.size} ตร.ม.</p>
                <p>ราคา: ฿{room.price}</p>
                <p>สถานะ: {room.status === "available" ? "ว่าง" : "ไม่ว่าง"}</p>
                <button onClick={() => editRoom(room.id)}>แก้ไข</button>
                <button onClick={() => deleteRoom(room.id)}>ลบ</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>ยังไม่มีห้องพักในระบบ</p>
        )}
      </div>
    </div>
  );
};

export default AdminRoomManagement;
