
import { FaEdit } from 'react-icons/fa'
import { FaRegTrashCan } from 'react-icons/fa6'
import useStore from '../store/useStore'
import { Link } from 'react-router-dom'
import { FaRegEye } from "react-icons/fa";
import { Blog } from '../types'



export default function BlogCard({blog,mode}:{blog:Blog,mode:"actions"|"no-actions"}) {

const endpointUrl:string = import.meta.env.VITE_ENDPOINT
const textElement =blog.data.filter(elm=>elm.type=="text")
const excerpt = textElement.length>0?textElement[0].content.slice(0,100):"no text in this blog"
const user = useStore((state:any)=>state.user)
const removeBlog = useStore((state:any)=>state.removeBlog)
const getUserBlogs = useStore((state:any)=>state.getUserBlogs)
console.log(blog);

const handleRemove = async()=>{
  await removeBlog(blog._id)
  await getUserBlogs()
}

  return (
    <div className='w-[350px] h-[400px] bg-white shadow-[0px_24px_50px_rgba(0,0,0,.1)] rounded-[15px] p-[25px] flex flex-col gap-[25px] transition-all hover:shadow-[0px_24px_50px_rgba(0,0,0,.15)]'>
        <div className='w-full h-[50%] bg-gray-200 rounded-[15px] bg-center bg-no-repeat bg-cover' style={{backgroundImage:`url(${endpointUrl+blog.featuredImage})`}}></div>
        <div className='w-full h-[40%] flex flex-col '>
            <div className='text-[20px] font-semibold'>{blog.title}</div>
            <div className='font-semibold opacity-50'>{blog.created_at.split("T")[0]}</div>
            {
              user._id==blog.userId?._id?
              <div className='text-[14px]  font-bold text-blue-500'>You</div>
              :
              <div className='text-[14px] opacity-50 font-bold'>{blog.userId?.fname} {blog.userId?.lname}</div>
            }
            <div className=''>{excerpt}...</div>
        </div>
        <div className='h-[10%] w-full items-center text-[25px] gap-[15px] flex flex-row-reverse'>
            {mode=='actions'?
            <>
            <FaRegTrashCan onClick={handleRemove} className='text-red-600 cursor-pointer'/>
            <Link  to={`/myblogs/edit/${blog._id}`}><FaEdit className='text-blue-800 cursor-pointer'/></Link>
            <Link to={`/blogs/${blog._id}`} ><FaRegEye className='text-blue-500 cursor-pointer'/></Link>
            </>
            :
            <>
            <Link to={`/blogs/${blog._id}`} className='text-[20px] text-white px-[25px] py-[5px] rounded-full bg-blue-500 transition-all hover:tracking-widest' >Read</Link>
            
            </>
            }
        </div>
    </div>
  )
}
