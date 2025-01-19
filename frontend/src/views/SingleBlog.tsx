import React, { useEffect, useState } from 'react'
import AppLayout from '../layouts/AppLayout'
import { useParams } from 'react-router-dom'
import useStore from '../store/useStore'

export default function SingleBlog() {
    interface Blog{
        _id:string,
        title:string,
        data:Array<Object>,
        featuredImage:string|null,
        created_at:string
    }
    const endpointUrl:string = import.meta.env.VITE_ENDPOINT
    const [blog,setBlog]= useState<Blog|false>()
    const blogId = useParams().id
    const getBlogById = useStore((state:any)=>state.getBlogById)
    const fetchAndSet = async ()=>{
        const blogOrFalse = await getBlogById(blogId)
        setBlog(blogOrFalse)
    }
    useEffect(()=>{
        fetchAndSet()
    },[])
    console.log(blog);

  return (
    <AppLayout>
        <div className='pt-[10vh]  min-h-screen w-full'>
            <div className='h-[40vh] w-full bg-blue-600  text-white bg-cover bg-center bg-no-repeat bg-fixed ' style={{backgroundImage:`url(${endpointUrl+blog?.featuredImage})`,textShadow:'2px 2px 10px rgba(0,0,0,.2)'}}>
                <div className='w-full h-full backdrop-brightness-50 flex justify-center items-center flex-col'>
                    <h1 className='text-[50px] font-bold '>{blog?.title}</h1>
                    <h2 className='text-[30px]'>{blog?.created_at?.split('T')[0]}</h2>
                </div>
            </div>
            <div className='w-full text-black h-full px-[20%] py-[10vh] flex flex-col gap-[25px]'>
                {blog?.data?.map(elm=>{
                    return (
                        elm.type=='text'?
                        <p>{elm.content}</p>
                        :
                        <img src={endpointUrl+elm.content} className='w-full'/>
                    )
                })}
            </div>
        </div>
    </AppLayout>
  )
}
