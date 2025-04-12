import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";

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
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "ห้องพักถูกเพิ่มเรียบร้อย",
        confirmButtonText: "ตกลง",
      });
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
    Swal.fire({
      title: "ยืนยันการลบห้องพัก",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบห้องพักนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("rooms").delete().eq("id", roomId);
        if (error) {
          console.error("Error deleting room:", error);
        } else {
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "ห้องพักถูกลบเรียบร้อย",
            confirmButtonText: "ตกลง",
          });
          fetchRooms(); // รีเฟรชรายการห้อง
        }
      }
    });

  };

  // ฟังก์ชันแก้ไขห้อง
  const editRoom = async (roomId) => {
    let newPrice = null;
    Swal.fire({
      title: "แก้ไขราคาห้องพัก",
      text: "กรุณากรอกราคาใหม่:",
      input: "number",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
      newPrice = result.value;
      if (newPrice) {
        const { error } = await supabase
          .from("rooms")
          .update({ price: newPrice })
          .eq("id", roomId);
        if (error) {
          console.error("Error updating room:", error);
        } else {
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "ห้องพักถูกแก้ไขเรียบร้อย",
            confirmButtonText: "ตกลง",
          });
          fetchRooms(); // รีเฟรชรายการห้อง
        }
      }
      }})

   
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div>
      <h2>เพิ่มห้องพัก</h2>
      <div className="d-flex">
        <div className="me-3">
          <label>ประเภทห้อง:</label>
          <input
            type="text"
            value={roomType}
            className="form-control"
            placeholder="กรุณากรอกประเภทห้อง"
            onChange={(e) => setRoomType(e.target.value)}
          />
        </div>
        <div className="me-3">
          <label>ขนาดห้อง (ตร.ม.):</label>
          <input
            type="text"
            className="form-control"
            placeholder="กรุณากรอกขนาดห้อง"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </div>
        <div className="me-3">
          <label>ราคา:</label>

          <input
            type="text"
            className="form-control"
            placeholder="กรุณากรอกราคา"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="me-3">
          <label>สถานะห้อง:</label>
          <select value={status} className="form-select" onChange={(e) => setStatus(e.target.value)}>
            <option value="available">ว่าง</option>
            <option value="unavailable">ไม่ว่าง</option>
          </select>
        </div>
        <div className="me-3">
          <label>อัปโหลดรูปห้อง:</label>
          <input type="file" className="form-control w-60" onChange={handleImageUpload} />
        </div>
        <button onClick={addRoom} className="btn btn-success" disabled={loading}>
          {loading ? "กำลังเพิ่มห้อง..." : "เพิ่ม"}
        </button>
      </div>
      <hr />


      <h2>รายการห้องพัก</h2>
      <div>
        {rooms.length > 0 ? (
          <div className="room-list row ">
            {rooms.map((room) => (
              <div className="col-3">
                <div className="card mx-4" key={room.id}>
                  <div className="d-flex justify-content-center items-center">
                    <img
                      src={room.image_url || "default-room-image.jpg"}
                      alt={room.room_type}
                      className="card-img-top "
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />

                  </div>
                  <hr />
                  <p className="py-0 ms-2 mb-1">ประเภทห้อง: {room.room_type}</p>
                  <p className="py-0 ms-2 mb-1">ขนาด: {room.size} ตร.ม.</p>
                  <p className="py-0 ms-2 mb-1">ราคา: ฿{room.price}</p>
                  <p className="py-0 ms-2 mb-1">สถานะ: {room.status === "available" ? "ว่าง" : "ไม่ว่าง"}</p>
                  <div className="d-flex mb-2">
                    <button className="btn btn-warning form-control mx-2" onClick={() => editRoom(room.id)}>แก้ไข</button>
                    <button className="btn btn-danger form-control mx-2 " onClick={() => deleteRoom(room.id)}>ลบ</button>
                  </div>

                </div>
              </div>

            ))}
          </div>
        ) : (
          <p>ยังไม่มีห้องพักในระบบ</p>
        )}
      </div>
    </div>
  );
};

export default AdminRoomManagement;
