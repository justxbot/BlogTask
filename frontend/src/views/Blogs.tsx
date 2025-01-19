import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import homeIllustration from '../assets/homeIllustration.svg'
import useStore from '../store/useStore'
import BlogCard from '../components/BlogCard'
import { useNavigate } from 'react-router-dom'
export default function Blogs() {

    const getBlogs = useStore((state:any)=>state.getBlogs)
    const blogs = useStore((state:any)=>state.blogs)

    useEffect(()=>{
        getBlogs()
    },[])

  return (
    <div className='min-h-screen w-full'>
        <Navbar/>
        <div className='w-full h-[60vh] bg-blue-600 flex justify-center px-[20%] pt-[10vh]'>
            <div className='w-full flex flex-col  justify-center text-white'>
                <p className='text-[20px] italic'>The blogTask</p>
                <h1  className='text-[50px] font-bold'>Discover intersting blogs from all around the world.</h1>
            </div>
            <div className='w-full flex items-center justify-center py-[50px] '>
                <img className='h-full' src={homeIllustration} alt="" />
            </div>
        </div>


        <div className='w-full  min-h-20 flex gap-[25px] justify-center flex-wrap py-[20px]'>
            {blogs.map((blog:object,i:number)=>{
                return (
                    <BlogCard key={i} blog={blog} mode='no-actions'/>
                )
            })}
            </div>
    </div>
  )
}
