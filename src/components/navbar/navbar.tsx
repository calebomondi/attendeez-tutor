import { Link } from "react-router-dom"
import { useAuth } from "../auth/useAuth"   
import apiService from "../../services/apiService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from  '/attendeez.png'

export default function NavBar() {
    const {user,signOut} = useAuth()

    const email = user?.email || 'nah@notworking.com'

    const [unit,setUnit] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await apiService.getTeacherInfo(email)
                if(result) {
                    const unit_id = result.units[0].unit_id;
                    setUnit(unit_id)
                } 
            } catch (error) {
                console.log(`Error: ${error}`)
            }
        }
        fetchData()
    },[]);

    const navigate = useNavigate()

    const handleClick = async () => {
        navigate(`/attendance?unit=${unit}`)
    }

  return (
    <div className="navbar bg-base-100 sticky top-0 z-50">
        <div className="navbar-start">
            <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li>
                    <Link to="/" className='text-lg'>Home</Link>
                </li>
                <li onClick={handleClick}>
                    <p className='text-lg'>All Attendance</p>
                </li>
            </ul>
            </div>
        </div>
        <div className="navbar-center">
            <Link to = "/" className='text-3xl'>
                <img 
                    src={logo} 
                    alt="" 
                    className="w-12"
                />
            </Link>
        </div>
        <div className="navbar-end">
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                    <img
                        alt="Tailwind CSS Navbar component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li>
                        <Link to="/profile" className='text-lg'>Profile</Link>
                    </li>
                    <li onClick={signOut}>
                        <span className='text-lg'>Logout</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}
