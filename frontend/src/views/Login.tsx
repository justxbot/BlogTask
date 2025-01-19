import React, { useEffect, useState } from 'react'
import loginIllustration from '../assets/loginIllustration.svg'
import { toast } from 'react-toastify'
import { isEmail } from '../utilities/isEmail'
import useStore from '../store/useStore'
import { Link, useNavigate } from 'react-router-dom'


export default function Login() {

    interface formData{
        email:String,
        pwd:String
    }
    const authenticate = useStore((state:any)=>state.authenticate)

    const [formData, setFormData] = useState<formData>({email:'',pwd:''})
    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault()
        //Extra validation for formData
        if(formData.email==''){
            toast.error("Email can not be empty")
        }
        else if(!isEmail(formData.email)){
            toast.error("Please enter a valid email")
        }
        else if(formData.pwd===''){
            toast.error("Password can not be empty")
        }
        else{
            await authenticate(formData)
        }
    }


  return (
    <div className='w-full min-h-screen  flex justify-center items-center  relative'>
                    <div className='absolute flex items-center  gap-[15px] right-0 top-0 translate-x-[-25px] translate-y-[25px]'>
                        <p>Don't have an account?</p>
                        <Link to={"/signup"} className=' text-blue-500 cursor-pointer font-semibold'>Signup</Link>
                    </div>

            <div className='h-full w-full flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-500'>
                <img src={loginIllustration}/>
            </div>
            <div className='w-full flex justify-center items-center'>
                <div className='w-[80%] flex flex-col gap-[100px]'>
                    <div>
                        <h1 className='text-[50px] font-bold'>Welcome to BlogTask</h1>
                        <p className='text-[20px]'>Please login using the form below.</p>
                    </div>

                    <form onSubmit={(e)=>handleSubmit(e)} className='w-full flex flex-col gap-[25px]'>
                        <div className='w-full flex flex-col gap-[15px]'>
                            <p className='text-[20px] font-bold'>Email:</p>
                            <input onChange={(e)=>setFormData({...formData,email:e.target.value})} type="email" placeholder='youremail@example.com' className='w-full border-2 rounded-[15px] border-blue-500 outline-none px-[25px] h-[50px]' />
                        </div>
                        <div className='w-full flex flex-col gap-[15px]'>
                            <p className='text-[20px] font-bold'>Password:</p>
                            <input onChange={(e)=>setFormData({...formData,pwd:e.target.value})} type="password" placeholder='Password' className='w-full border-2 rounded-[15px] border-blue-500 outline-none px-[25px] h-[50px]' />
                        </div>
                        <button type='submit' className='text-[20px] bg-blue-500 text-white px-[50px] py-[10px] rounded-full w-fit cursor-pointer'>Login</button>
                    </form>
                </div>
            </div>
    </div>
  )
}
