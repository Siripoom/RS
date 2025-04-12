import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const AdminLayout = () => {
    const handleLogout = () => {
        localStorage.removeItem('auth')
        window.location.href = '/login'
    }
    return (
        <div className="h-min-screen bg-gray-100 p-0">
            <div className="row">
                <div className="col-2 p-0 ">
                    <Sidebar />
                </div>
                <div className="col-10">
                    <div className="row">
                        <div className="col-12 py-3 bg-white shadow-md flex justify-between pe-5 align-middle">
                            <h5 className="">ระบบจัดการโรงแรม</h5>
                            <button href="" onClick={handleLogout} className=" text-black">ออกจากระบบ</button>
                        </div>

                    </div>
                    <div className="col-12 py-4 px-3">
                        <div className="card ">
                            <div className="card-body">
                                <Outlet />
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>


    )
}

export default AdminLayout