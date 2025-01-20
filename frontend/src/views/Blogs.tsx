import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import homeIllustration from '../assets/homeIllustration.svg'
import useStore from '../store/useStore'
import BlogCard from '../components/BlogCard'
import { Blog } from '../types'
import BlogCardPlaceholder from '../placeholders/BlogCardPlaceholder'
import { Link } from 'react-router-dom'
export default function Blogs() {

    const getBlogs = useStore((state:any)=>state.getBlogs)
    const blogs = useStore((state:any)=>state.blogs)
    const blogsLoading = useStore((state:any)=>state.blogsLoading)
    useEffect(()=>{
        getBlogs()
    },[])

  return (
    <div className='min-h-screen w-full'>
        <Navbar/>
        <div className='w-full min-h-[60vh] bg-blue-600 flex justify-center lx:px-[20%] md:px-[15%] pt-[10vh] md:pb-[0vh] pb-[10vh] md:flex-row flex-col-reverse overflow-hidden '>
            <div className='w-full flex flex-col  justify-center text-white md:text-left text-center'>
                <p className='xl:text-[20px] md:text-[16px] text-[16px] italic'>The blogTask</p>
                <h1  className='xl:text-[50px] md:text-[40px] text-[24px] font-bold'>Discover intersting blogs from all around the world.</h1>
            </div>
            <div className='w-full flex items-center justify-center py-[50px] '>
                <img className='h-full' src={homeIllustration} alt="" />
            </div>
        </div>


        <div className='w-full  min-h-20 flex gap-[25px] justify-center flex-wrap py-[20px]'>
        {blogsLoading?
            <>
                <BlogCardPlaceholder/> 
                <BlogCardPlaceholder/> 
                <BlogCardPlaceholder/> 

            </>
            :
            blogs.length<=0?
            <div className='flex flex-col gap-[15px]'>
                <h2 className='text-[20px] text-center'>No blogs yet</h2>
                <Link to={'/myblogs/create'} className='bg-blue-500 rounded-full font-semibold transition-all text-white w-fit px-[25px] py-[10px] hover:tracking-widest cursor-pointer'>Start creating</Link>
            </div>
            :
            blogs.map((blog:Blog,i:number)=>{
                return (
                    <BlogCard key={i} blog={blog} mode='no-actions'/>
                )
            })}
            </div>
    </div>
  )
}
