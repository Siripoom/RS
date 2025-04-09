import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const BookingStatus = () => {
  const [bookingId, setBookingId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkBookingStatus = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("bookings")
      .select("status")
      .eq("id", bookingId)
      .single();

    if (error) {
      setError("ไม่พบการจองนี้");
    } else {
      setStatus(data.status);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>ตรวจสอบสถานะการจอง</h1>
      <div>
        <label>หมายเลขการจอง:</label>
        <input
          type="text"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />
      </div>
      <button onClick={checkBookingStatus} disabled={loading}>
        {loading ? "กำลังตรวจสอบ..." : "ตรวจสอบสถานะ"}
      </button>

      {status && <p>สถานะการจอง: {status}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default BookingStatus;
