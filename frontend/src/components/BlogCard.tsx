import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { FaRegTrashCan } from 'react-icons/fa6'
import useStore from '../store/useStore'
import { Link } from 'react-router-dom'


interface Blog{
    _id:string,
    title:string,
    data:Array<Object>,
    featuredImage:string|null,
    created_at:string
}

export default function BlogCard({blog,mode}:{blog:Blog,mode:"actions"|"no-actions"}) {

  const endpointUrl:string = import.meta.env.VITE_ENDPOINT
const textElement =blog.data.filter(elm=>elm.type=="text")
const excerpt = textElement.length>0?textElement[0].content.slice(0,100):"no text in this blog"

const removeBlog = useStore((state:any)=>state.removeBlog)
const getBlogs = useStore((state:any)=>state.getBlogs)

const handleRemove = async()=>{
  await removeBlog(blog._id)
  await getBlogs()
}

  return (
    <div className='w-[350px] h-[400px] bg-white shadow-[0px_24px_50px_rgba(0,0,0,.1)] rounded-[15px] p-[25px] flex flex-col gap-[25px]'>
        <div className='w-full h-[50%] bg-gray-200 rounded-[15px] bg-center bg-no-repeat bg-cover' style={{backgroundImage:`url(${endpointUrl+blog.featuredImage})`}}></div>
        <div className='w-full h-[40%] flex flex-col '>
            <div className='text-[20px] font-semibold'>{blog.title}</div>
            <div className='font-semibold opacity-50'>{blog.created_at.split("T")[0]}</div>
            <div className=''>{excerpt}...</div>
        </div>
        <div className='h-[10%] w-full items-center text-[25px] gap-[15px] flex flex-row-reverse'>
            {mode=='actions'?
            <>
            <FaRegTrashCan onClick={handleRemove} className='text-red-600 cursor-pointer'/>
            <Link  to={`/myblogs/edit/${blog._id}`}><FaEdit className='text-blue-800 cursor-pointer'/></Link>
            </>
            :
            <Link to={`/blogs/${blog._id}`} className='text-[20px] text-white px-[25px] py-[5px] rounded-full bg-blue-500'>Read</Link>
            }
        </div>
    </div>
  )
}
