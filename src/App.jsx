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
function App() {
  return (
    <Router>
      <Routes>
        {/* success  */}
        <Route exact path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />


        {/* unsuccess */}
        <Route path="/admin/manage-rooms" element={<AdminRoomManagement />} />
        <Route
          path="/admin/manage-payments"
          element={<AdminPaymentManagement />}
        />
        
        <Route path="/" element={<RoomList />} />
        <Route path="/room/:roomId" element={<RoomDetails />} />
        <Route path="/book/:roomId" element={<BookingForm />} />
        <Route path="/auth-status" element={<AuthStatus />} />
        <Route path="/booking-status" element={<BookingStatus />} />
        <Route path="/payment/:bookingId" element={<PaymentForm />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
