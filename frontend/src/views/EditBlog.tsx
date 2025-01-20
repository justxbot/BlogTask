import React, { useEffect, useState } from 'react'
import AppLayout from '../layouts/AppLayout'
import { MdOutlineTextFields } from "react-icons/md";
import { GoFileMedia } from "react-icons/go";
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { IoClose } from "react-icons/io5";
import useStore from '../store/useStore';
import { useNavigate, useParams } from 'react-router-dom';
import BlogContentPlaceholder from '../components/BlogContentPlaceholder';

export default function EditBlog() {
    const endpointUrl:string = import.meta.env.VITE_ENDPOINT
    interface content{
        type:"text"|"img",
        content:string,
        isEditing?:boolean,
        blob?:File
    }
    interface featuredImage{
        blob:File | null,
        url:string | null
    }
    const navigate = useNavigate()
    const [title, setTitle] = useState<string>('')
    const [featuredImg,setFeaturedImg] = useState<featuredImage>({blob:null,url:null})
    const [isCreating,setIsCreating] = useState<Boolean>(false)
    const [blogContent,setBlogContent]= useState<Array<content>>([])
    const [isModal,setIsModal] = useState<Boolean>(false)
    const [paragraphContent, setParagraphContent] = useState<string>("")
    const [paragraphEditingContent, setParagraphEditingContent] = useState<string>("")
    const [imgContent,setImgContent] = useState<File>()

    const blogId:string|undefined = useParams().id
    const getBlogById = useStore((state:any)=>state.getBlogById)
    const blogsLoading = useStore((state:any)=>state.blogsLoading)
    const fetchAndSet = async ()=>{
        const blog = await getBlogById(blogId)
        if(blog){
            setTitle(blog.title)
            setFeaturedImg({blob:null,url:blog.featuredImage})
            setBlogContent(blog.data)
        }
        else{
            navigate('/404')
        }
    }

    useEffect(()=>{
        fetchAndSet()
    },[])




    const cancelParagraph = ()=>{
        setParagraphContent('')
        setIsCreating(false)
    }
    const addParagraph = ()=>{
        if(paragraphContent===''){
            toast.error('paragpraph can not be empty')
        }
        else{
            setBlogContent([...blogContent,{type:"text",content:paragraphContent, isEditing:false}])
            setIsCreating(false)
            setParagraphContent('')
        }
    }
    const updatingParagraph = (index:number)=>{
        const openEditsCount = blogContent.filter((elm)=> elm.isEditing).length
        if(openEditsCount>0){
            toast.error("You already have an open edit tab")
        }
        else{
            setBlogContent(blogContent.map((elm,i)=>{
                if(index===i){
                    elm.isEditing = true
                    setParagraphEditingContent(elm.content)
                }
                return elm
            }))
        }
    }
    const confirmParagraphUpdate = (index:number)=>{
        if(paragraphEditingContent==""){
            toast.error("Paragraph can not be empty")
        }
        else{
            setBlogContent(blogContent.map((elm,i)=>{
                if(index===i){
                    elm.isEditing = false
                    elm.content = paragraphEditingContent
                }
                return elm
            }))
            setParagraphEditingContent("")
        }
    }
    const cancelParagraphUpdate = (index:number)=>{
        setParagraphEditingContent("")
        setBlogContent(blogContent.map((elm,i)=>{
            if(index===i){
                elm.isEditing = false
            }
            return elm
        }))
    }
    const removeContent = (index:number)=>{
        setBlogContent(blogContent.filter((_,i)=>index!==i))
    }
    const handleModalExit = (e:React.MouseEvent)=>{
        if(e.target==e.currentTarget){
            setIsModal(false)
            setImgContent(undefined)
        }
    }
    const addImg = ()=>{
        if(imgContent){
            const imgUrl = URL.createObjectURL(imgContent)
            setBlogContent([...blogContent,{type:"img",content:imgUrl, isEditing:false,blob:imgContent}])
            setIsModal(false)
            setImgContent(undefined)
        }
    }
    const handleFeaturedImg = (e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files){

            const fileBlob = e.target.files[0]
            const fileUrl = URL.createObjectURL(fileBlob)
            setFeaturedImg({blob:fileBlob,url:fileUrl})
        }
    }
    const cancelFeaturedImg = ()=>{
        setFeaturedImg({blob:null,url:null})
    }

    const updateBlog = useStore((state:any)=>state.updateBlog)

    const submitBlog = async () => {
        // Create a FormData instance
        const formData = new FormData();
        
        // Add basic text data and ID
        formData.append('title', title);
        if(blogId){
            formData.append('_id', blogId);
        }
        
        // Handle the blog content array
        const processedData = await Promise.all(
            blogContent.map(async (item) => {
                if (item.type === 'img' && item.content.startsWith('blob:')) {
                    // Only convert blob URLs, keep existing media URLs as is
                    const response = await fetch(item.content);
                    const blob = await response.blob();
                    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                    
                    const imageKey = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    formData.append(imageKey, file);
                    
                    return {
                        ...item,
                        content: imageKey
                    };
                }
                return item;
            })
        );
        
        formData.append('data', JSON.stringify(processedData));
        
        // Handle featured image only if it exists and has a URL
        if (featuredImg?.url) {
            if (featuredImg.url.startsWith('blob:')) {
                const response = await fetch(featuredImg.url);
                const blob = await response.blob();
                const file = new File([blob], 'featured.jpg', { type: 'image/jpeg' });
                formData.append('featuredImage', file);
            }
        } else {
            // If no featured image, set it to null explicitly
            formData.append('featuredImage', 'null');
        }
    
        if (!title) {
            toast.error("Title cannot be empty");
            return;
        }
        if (processedData.length < 1) {
            toast.error("Your blog is empty");
            return;
        }
    
        // Send formData instead of JSON
        await updateBlog(formData);
        navigate('/myblogs')
    };
  return (
    <AppLayout>
        <div className='w-full flex  min-h-screen pt-[20vh] pb-[10vh] px-[10%]  gap-[25px] md:flex-row flex-col '>
        <div className=' flex md:w-[80%] w-full flex-col gap-[50px]'>
                <input type='text' defaultValue={title} placeholder='Blog Title' onChange={(e)=>setTitle(e.target.value)} className='w-full min-h-[50px] outline-none rounded-[15px] text-[30px] border-2 border-blue-500 px-[25px] py-[15px]'/>
                <div>
                    {
                    blogsLoading?
                    <BlogContentPlaceholder/>
                    :
                    blogContent.map((elm,i)=>{
                        return(
                        elm.isEditing?
                        <div key={i} className='w-full  flex justify-between group  p-[25px] '>
                            <textarea onChange={(e)=>setParagraphEditingContent(e.target.value)}  className='w-full outline-none p-[25px]' placeholder='Paragraph...'>{elm.content}</textarea>
                            <div className='flex text-[20px] gap-[10px] items-center opacity-100  xl:opacity-0 xl:group-hover:opacity-100 transition-all'>
                                <FaCheck onClick={()=>confirmParagraphUpdate(i)} className='text-blue-500 cursor-pointer'/>
                                <IoClose onClick={()=>cancelParagraphUpdate(i)} className='text-red-500 cursor-pointer text-[30px]'/>
                            </div>
                        </div>
                        :
                        elm.type=="text"?
                        <div key={i} className='w-full  flex justify-between group  p-[25px] '>
                            <div>{elm.content}</div>
                            <div className='flex text-[20px] gap-[10px] items-center opacity-100  xl:opacity-0 xl:group-hover:opacity-100 transition-all '>
                                <FaEdit onClick={()=>updatingParagraph(i)} className='text-blue-500 cursor-pointer'/>
                                <FaTrash onClick={()=>removeContent(i)} className='text-red-500 cursor-pointer'/>
                            </div>
                        </div>
                        :
                        <div key={i} className='w-full relative flex justify-between group  '>
                            <img src={elm.blob?elm.content:endpointUrl+elm.content} className='w-full ' />
                            <div className='bg-white rounded-[15px] p-[10px] absolute right-0 top-0 translate-x-[-25px] translate-y-[25px] opacity-100  xl:opacity-0 xl:group-hover:opacity-100 transition-all'>
                                <FaTrash onClick={()=>removeContent(i)} className='text-red-500 cursor-pointer   '/>
                            </div>
                        </div>
                        )
                    })}

                {isCreating?
                    <div className='w-full  flex justify-between group   '>
                    <textarea onChange={(e)=>setParagraphContent(e.target.value)} className='w-full outline-none p-[25px]' placeholder='Paragraph...'></textarea>
                    <div className='flex text-[20px] gap-[10px] opacity-100  xl:opacity-0 xl:group-hover:opacity-100 transition-all items-center  '>
                        <FaCheck onClick={addParagraph} className='text-blue-500 cursor-pointer'/>
                        <IoClose onClick={cancelParagraph} className='text-red-500 cursor-pointer text-[30px]'/>
                    </div>
                </div>
                :                
                <div className='flex items-center gap-[15px]'>
                    <div onClick={()=>setIsCreating(true)} className='w-[50px] h-[50px] rounded-full bg-blue-500 flex items-center justify-center cursor-pointer'>
                        <MdOutlineTextFields className='text-white text-[25px]'/>
                    </div>
                    <div onClick={()=>setIsModal(true)} className='w-[50px] h-[50px] rounded-full bg-blue-500 flex items-center justify-center cursor-pointer'>
                        <GoFileMedia className='text-white text-[25px]'/>
                    </div>
                </div>
                }

                </div>
                

           </div>
           <div className='h-fit  md:w-[20%] w-full  '>
                <div className='bg-gray-100 w-full min-h-20 p-[25px] flex flex-col gap-[25px] rounded-[15px]'>
                    <h3 className='xl:text-[26px] text-[20px] font-semibold'>Featured Image</h3>
                    {featuredImg.url?
                        <div className='w-full h-[200px] bg-red-200 rounded-[15px] bg-no-repeat bg-center bg-cover' style={{backgroundImage:`url(${featuredImg.blob?featuredImg.url:endpointUrl+featuredImg.url})`}}>

                        </div>
                        :
                        <input onChange={(e)=>handleFeaturedImg(e)}  type="file" accept='image/*' />
                    }

                    <div className='flex gap-[15px] flex-wrap items-center justify-center'>
                        <div onClick={submitBlog} className='text-white bg-blue-500 w-fit px-[25px] py-[5px] rounded-full cursor-pointer transition-all hover:tracking-widest'>Publish</div>
                        {featuredImg.url && <div onClick={cancelFeaturedImg} className='text-white bg-red-500 w-fit px-[25px] py-[5px] rounded-full cursor-pointer transition-all hover:tracking-widest'>Remove</div>}
                    </div>
                </div>
           </div>
        </div>
        {/* Image Upload Modal */}
        {isModal && 
        <div onClick={(e)=>handleModalExit(e)} className='w-full h-full fixed backdrop-blur-[8px] left-0 top-0 flex items-center justify-center bg-[rgba(0,0,0,.3)] z-[99]'>
            <div className='p-[25px] flex flex-col gap-[25px] bg-white rounded-[15px] shadow-[0px_0px_50px_rgba(0,0,0,.1)]'>
                <input onChange={(e)=>{
                    if(e.target.files){
                        setImgContent(e.target.files[0])
                    }
                }} accept='image/*' type="file" />
                {imgContent &&
                <div className='w-full flex flex-row-reverse gap-[15px]'>
                    <div onClick={addImg} className='text-white bg-blue-500 w-fit px-[25px] py-[5px] rounded-full cursor-pointer'>Add</div>
                    <div className='text-white bg-red-500 w-fit px-[25px] py-[5px] rounded-full cursor-pointer'>Cancel</div>
                </div>
                }
            </div>
        </div>
        }
        
    </AppLayout>
  )
}
