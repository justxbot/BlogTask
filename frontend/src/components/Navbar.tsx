import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoMdExit } from "react-icons/io";
import useStore from '../store/useStore';
import { FaArrowRightLong } from "react-icons/fa6";


export default function Navbar() {

    const logout = useStore((state:any)=>state.logout)
    const user = useStore((state:any)=>state.user)
    const isMobile = window.innerWidth<768
    const [isMobileDisplay, setIsMobileDisplay] = useState<boolean>(false)
    const [dropDownSettings, setDropDownSettings] = useState<boolean>(false)
    const handleLogout = ()=>{
        logout()
    }

  return (
    <div className='fixed left-0 top-0 w-full flex items-center justify-between px-[10%] min-h-[10vh] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] bg-white z-[9]    '>
        <div className='text-[30px] font-bold text-blue-500'>BlogTask</div>
        
        {isMobile?
        <>
            <div onClick={()=>setIsMobileDisplay(true)} className='flex flex-col w-[50px] gap-[5px] '>
                <div className='h-2 w-full bg-gradient-to-r from-blue-500 to-blue-800 rounded-full'></div>
                <div className='h-2 w-full bg-gradient-to-r from-blue-500 to-blue-800 rounded-full'></div>
                <div className='h-2 w-full bg-gradient-to-r from-blue-500 to-blue-800 rounded-full'></div>
            </div>
            
            <div className={`fixed ${isMobileDisplay?"left-0":"left-[100%]"} transition-all top-0 w-full h-full bg-gradient-to-br from-blue-400 to-blue-500 flex flex-col items-center justify-center gap-[50px] z-[999]`}>
                <FaArrowRightLong onClick={()=>setIsMobileDisplay(false)} className='text-white text-[30px]  font-bold absolute top-0 right-0 translate-x-[-25px] translate-y-[25px]'/>
                <div className='w-[50px] h-[50px] rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold text-[20px] border-2 border-blue-500 relative cursor-pointer'>
                    {user && user.fname[0]+user.lname[0]}
                </div>

                <div className='flex items-center flex-col justify-center gap-[15px] text-[20px] text-white'>
                    <Link onClick={()=>setIsMobileDisplay(false)} className='cursor-pointer' to='/'>Blogs</Link>
                    <Link onClick={()=>setIsMobileDisplay(false)} className='cursor-pointer' to='/myblogs'>My blogs</Link>
                </div>

                <div onClick={handleLogout} className='cursor-pointer text-gray-300 flex items-center gap-[10px]  text-[20px] font-semibold' ><IoMdExit/> Logout</div>
            </div>
        </>

        :
        <>
        <div className='flex items-center justify-center gap-[25px] text-[20px] '>
            <Link className='cursor-pointer  transition-all hover:tracking-widest' to='/'>Home</Link>
            <Link className='cursor-pointer  transition-all hover:tracking-widest' to='/myblogs'>My blogs</Link>
        </div>
        <div onClick={()=>setDropDownSettings(!dropDownSettings)} className='w-[50px] h-[50px] rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold text-[20px] border-2 border-blue-500 relative cursor-pointer'>
            {user && user.fname[0]+user.lname[0]}
            {dropDownSettings && 
            <div className='absolute bg-white px-[20px] py-[10px] top-[100%] right-[100%] rounded-[15px] rounded-tr-none shadow-[0px_25px_50px_rgba(0,0,0,0.2)] '>
                <div onClick={handleLogout} className='cursor-pointer transition-all hover:tracking-widest text-red-600 flex items-center gap-[10px]  text-[20px] font-semibold' ><IoMdExit/> Logout</div>
            </div>
            }
        </div>
        </>
        }



    </div>
  )
}
