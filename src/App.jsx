import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthStatus from "./components/AuthStatus";
import RoomList from "./pages/RoomList";
import RoomDetails from "./pages/RoomDetails";
import BookingForm from "./components/BookingForm";
import PaymentForm from "./components/PaymentForm";
import BookingStatus from "./components/BookingStatus";
import AdminRoomManagement from "./pages/AdminRoomManagement";
import AdminPaymentManagement from "./pages/AdminPaymentManagement";
import AdminLayout from "./layouts/AdminLayout";
function App() {
  return (
    <Router>
      <Routes>
        {/* success  */}
        <Route exact path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RoomList />} />
        <Route path="/book/:roomId" element={<BookingForm />} />
        <Route path="/payment/:bookingId" element={<PaymentForm />} />
        <Route path="/room/:roomId" element={<RoomDetails />} />
        <Route path="/booking-status" element={<BookingStatus />} />
        <Route path="/auth-status" element={<AuthStatus />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />


        {/* unsuccess */}
        <Route element={<AdminLayout />} >
          <Route path="/admin/manage-rooms" element={<AdminRoomManagement />} />
          <Route
            path="/admin/manage-payments"
            element={<AdminPaymentManagement />}
          />
        </Route>



      </Routes>
      <div className="fixed-bottom bg-black text-white py-auto">
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <p>© 2024 Hotel Booking System</p>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
