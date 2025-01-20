import { useEffect, useState } from 'react'
import AppLayout from '../layouts/AppLayout'
import { useNavigate, useParams } from 'react-router-dom'
import useStore from '../store/useStore'
import { Blog } from '../types'
import BlogContentPlaceholder from '../components/BlogContentPlaceholder'

export default function SingleBlog() {
    const endpointUrl:string = import.meta.env.VITE_ENDPOINT
    const [blog,setBlog]= useState<Blog>()
    const blogId = useParams().id
    const getBlogById = useStore((state:any)=>state.getBlogById)
    const user = useStore((state:any)=>state.user)
    const navigate = useNavigate()
    const fetchAndSet = async ()=>{
        const blogOrFalse = await getBlogById(blogId)
        if(!blogOrFalse){
            navigate('/404')
        }
        setBlog(blogOrFalse)
    }
    useEffect(()=>{
        fetchAndSet()
    },[])

  return (
    <AppLayout>
        <div className='pt-[10vh]  min-h-screen w-full'>
            <div className='h-[40vh] w-full bg-white  text-white bg-cover bg-center bg-no-repeat bg-fixed ' style={{backgroundImage:`url(${endpointUrl+blog?.featuredImage})`,textShadow:'2px 2px 10px rgba(0,0,0,.2)'}}>
            {
                !blog?
                <div className='w-full h-full backdrop-brightness-[90%] flex justify-center items-center flex-col md:gap-[25px] gap-[15px]'>
                    <h2 className='md:h-[20px] rounded-full w-[30%] bg-white animate-pulse'></h2>
                    <h2 className='md:h-[20px] rounded-full w-[15%] bg-white animate-pulse'></h2>
                    <h2 className='md:h-[20px] rounded-full w-[10%] bg-white animate-pulse'></h2>
                </div>
                :
                <div className='w-full h-full backdrop-brightness-50 flex justify-center items-center flex-col'>
                    <h1 className='md:text-[50px] text-[30px] font-bold '>{blog?.title}</h1>
                    <h2 className='md:text-[30px] text-[20px]'>{blog?.created_at?.split('T')[0]}</h2>
                    <h2 className='md:text-[20px] text-[16px] bg-blue-500 rounded-full px-[20px]'>{
                    user._id==blog?.userId?._id?
                    "You"
                    :
                    blog?.userId?.fname+" "+blog?.userId?.lname
                    }
                    </h2>
                </div>
            }

            </div>
            <div className='w-full text-black h-full md:px-[20%] px-[10%] py-[10vh] flex flex-col gap-[25px]'>
            {
                !blog?
                <BlogContentPlaceholder/>
                :
                blog?.data?.map(elm=>{
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
