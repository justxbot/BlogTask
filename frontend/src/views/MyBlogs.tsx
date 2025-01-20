import React, { useEffect, useState } from 'react'
import AppLayout from '../layouts/AppLayout'

import BlogCard from '../components/BlogCard';
import { Link } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import useStore from '../store/useStore';
import { Blog } from '../types';
import BlogCardPlaceholder from '../placeholders/BlogCardPlaceholder';

export default function MyBlogs() {

    const getUserBlogs= useStore((state:any)=>state.getUserBlogs)
    const userBlogs= useStore((state:any)=>state.userBlogs)
    const blogsLoading = useStore((state:any)=>state.blogsLoading)
    useEffect(()=>{
        getUserBlogs()
    },[])

  return (
    <AppLayout>
        <div className='w-full  min-h-screen pt-[20vh] pb-[10vh] px-[10%] flex flex-col gap-[25px]'>
            <Link to="/myblogs/create" className=" bg-blue-500 text-white w-fit py-[5px] px-[15px] rounded-full flex items-center gap-[10px] transition-all hover:tracking-widest">Add Blog <IoMdAdd/></Link>
            <div className='w-full  min-h-20 flex gap-[25px] justify-center flex-wrap'>
            {blogsLoading   ?
            <>
                <BlogCardPlaceholder/> 
                <BlogCardPlaceholder/> 
                <BlogCardPlaceholder/> 

            </>
            :
            userBlogs.length<=0?
            <div className='flex flex-col gap-[15px]'>
                <h2 className='text-[20px] text-center'>No blogs yet</h2>
                <Link to={'/myblogs/create'} className='bg-blue-500 rounded-full font-semibold transition-all text-white w-fit px-[25px] py-[10px] hover:tracking-widest cursor-pointer'>Start creating</Link>
            </div>
            :
            userBlogs.map((blog:Blog,i:number)=>{
                return (
                    <BlogCard key={i} blog={blog} mode='actions'/>
                )
            })
            }
            
            </div>
        </div>
    </AppLayout>
  )
}
