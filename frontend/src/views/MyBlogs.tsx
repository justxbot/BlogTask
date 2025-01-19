import React, { useEffect, useState } from 'react'
import AppLayout from '../layouts/AppLayout'

import BlogCard from '../components/BlogCard';
import { Link } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import useStore from '../store/useStore';

export default function MyBlogs() {
    interface Blog{
        _id:string,
        title:string,
        data:Array<Object>,
        featuredImage:string|null,
        created_at:string
    }
    const getUserBlogs= useStore((state:any)=>state.getUserBlogs)
    const userBlogs= useStore((state:any)=>state.userBlogs)

    useEffect(()=>{
        getUserBlogs()
    },[])

  return (
    <AppLayout>
        <div className='w-full  min-h-screen pt-[20vh] pb-[10vh] px-[10%] flex flex-col gap-[25px]'>
            <Link to="/myblogs/create" className=" bg-blue-500 text-white w-fit py-[5px] px-[15px] rounded-full flex items-center gap-[10px]">Add Blog <IoMdAdd/></Link>
            <div className='w-full  min-h-20 flex gap-[25px] justify-center flex-wrap'>
            {userBlogs.map((blog:Blog,i:number)=>{
                return (
                    <BlogCard key={i} blog={blog} mode='actions'/>
                )
            })}
            </div>
        </div>
    </AppLayout>
  )
}
