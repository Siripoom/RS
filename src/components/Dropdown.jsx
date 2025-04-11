import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Dropdown = ({ label, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title:"ออกจากระบบเสร็จสิ้น",
      icon:"success",
      timer:1500,
    }).then(() => {
      localStorage.removeItem('auth');
      navigate('/login');
    })
    

  }
  return (
    <div className="dropdown my-auto">
      <a
        className="text-black my-auto dropdown-toggle"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </a>
      <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
        <li >
          <a
            className="dropdown-item"
            href="#"
            onClick={
              handleLogout
            }
          >
            ออกจากระบบ
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Dropdown; 