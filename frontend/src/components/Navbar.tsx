import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoMdExit } from "react-icons/io";
import useStore from '../store/useStore';

export default function Navbar() {

    const logout = useStore((state:any)=>state.logout)
    const user = useStore((state:any)=>state.user)
    const [dropDownSettings, setDropDownSettings] = useState<boolean>(false)
    const handleLogout = ()=>{
        logout()
    }

  return (
    <div className='fixed left-0 top-0 w-full flex items-center justify-between px-[10%] min-h-[10vh] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] bg-white z-[9]    '>
        <div className='text-[30px] font-bold text-blue-500'>BlogTask</div>
        <div className='flex items-center justify-center gap-[25px] text-[20px] '>
            <Link className='cursor-pointer' to='/'>Home</Link>
            <Link className='cursor-pointer' to='/myblogs'>My blogs</Link>
        </div>
        
        <div onClick={()=>setDropDownSettings(!dropDownSettings)} className='w-[50px] h-[50px] rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold text-[20px] border-2 border-blue-500 relative cursor-pointer'>
        {user && user.fname[0]+user.lname[0]}
        {dropDownSettings && 
        <div className='absolute bg-white px-[20px] py-[10px] top-[100%] right-[100%] rounded-[15px] rounded-tr-none shadow-[0px_25px_50px_rgba(0,0,0,0.2)] '>
            <div onClick={handleLogout} className='cursor-pointer text-red-600 flex items-center gap-[10px]  text-[20px] font-semibold' ><IoMdExit/> Logout</div>
        </div>
        }
        </div>


    </div>
  )
}
