import React from 'react'
import { Link } from 'react-router-dom'
import './css/sidebar.css'
const Sidebar = () => {
  return (
    <div className='h-min-screen h-screen m-0 sidebar shadow-xl px-3 '>
      <div className="profile pt-3">
        <p className='text-white font-medium text-xl'>ชื่อ : ชื่อผู้ใช้งาน</p>
      </div>
      <hr />
      <div className="w-full d-flex flex-col justify-between align-middle">
        <Link className='side-item text-white ms-3  py-2 ' to={'/admin/manage-rooms'}>รายการห้อง</Link>
        <Link className='side-item text-white ms-3  py-2 ' to={'/admin/manage-payments'}>รายการชำระเงิน</Link>
      </div>



    </div>
  )
}

export default Sidebar