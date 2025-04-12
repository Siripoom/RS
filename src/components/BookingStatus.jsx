import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import Navbar from "./Navbar";

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
    <div className="h-screen bg-gray-100">
      <Navbar userName={"Username"} />
      <div className="card mx-5 my-5 bg-white shadow-md rounded-lg">
        <div className="card-body py-5 px-5">
          <h1>ตรวจสอบสถานะการจอง</h1>
          <div className="row">

            <div className="col-12 col-sm-12 col-md-6">
              <div>
                <label>หมายเลขการจอง:</label>
                <input
                  type="text"
                  value={bookingId}
                  className="form-control"
                  placeholder="กรุณากรอกหมายเลขการจอง"
                  onChange={(e) => setBookingId(e.target.value)}
                />
              </div>
              <button onClick={checkBookingStatus} className="btn btn-success mt-4 form-control" disabled={loading}>
                {loading ? "กำลังตรวจสอบ..." : "ตรวจสอบสถานะ"}
              </button>
            </div>

            <div className="col-12 col-sm-12 col-md-6 ps-5 border-start">
              {loading && <p>กำลังโหลด...</p>}
              {status && <p>สถานะการจอง: {status}</p>}
              {error && <p>{error}</p>}
            </div>
          </div>






        </div>
      </div>

    </div>
  );
};

export default BookingStatus;
