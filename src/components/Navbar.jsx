import React from 'react'
import Dropdown from './Dropdown'
import { Link } from 'react-router-dom'
import "./css/navbar.css"
const Navbar = ({userName}) => {
    return (
        <div className="row">
            <div className="col-12">
                <div className="d-flex justify-content-between px-5 ps-2 pe-5 py-auto bg-amber-400 shadow-xl">
                    <h3 className="font-bold text-center my-3">โรงแรม |</h3>
                    <Link to={"/"} className=" link-item my-auto ms-3 text-black">จองห้องพัก</Link>
                    <Link to={"/booking-status"} className=" link-item me-auto my-auto ms-3 text-black">ตรวจสอบสถานะการจอง</Link>
                    <Dropdown label={userName} />
                </div>
            </div>
        </div>
    )
}

export default Navbar