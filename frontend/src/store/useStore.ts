import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { create } from "zustand";

const endpointUrl:string = import.meta.env.VITE_ENDPOINT
interface Blog{
    title:string,
    messages:Array<Object>,
    featuredImqge:string | null

}

const useStore = create((set)=>({
    
    blogs: [],
    userBlogs:[],
    user:null,
    blogsLoading:false,
    userLoading:false,
    userCheckLoading:false,
    getBlogs: async()=>{
        set({blogsLoading:true})
        try{
            const res = await axios.get(endpointUrl+'/blogs',{withCredentials:true})
            if(res){
                set({blogs:res.data.blogs})
            }
        }catch(err){
            console.log(err);
        }
        finally{
            set({blogsLoading:false})
        }
    },
    getUserBlogs: async()=>{
        set({blogsLoading:true})
        try{
            const res = await axios.get(endpointUrl+'/myblogs',{withCredentials:true})
            if(res){
                set({userBlogs:res.data.userBlogs})
            }
        }catch(err){
            console.log(err);
        }
        finally{
            set({blogsLoading:false})
        }
    },
    getBlogById: async(payload:string)=>{
        set({blogsLoading:true})
        try{
            const res = await axios.get(endpointUrl+'/blogs/'+payload,{withCredentials:true})
            if(res){
                return res.data.blog
            }
            else{
                return false
            }
        }catch(err){
            console.log(err);
        }
        finally{
            set({blogsLoading:false})
        }
    },
    signup: async(payload:object)=>{
        try{
            const res = await axios.post(endpointUrl+'/signup',payload,{withCredentials:true})
            console.log("res",res);
            
            if(res){
                toast.success(res.data.message)
            }
        }catch(err){

            toast.error(err.response.data.message)
        }
    },
    authenticate: async(payload:object)=>{
        set({userLoading:true})
        try{
            const res = await axios.post(endpointUrl+'/login',payload,{withCredentials:true})
            if(res){
                set({user:res.data.user})
                window.location.href="/"
            }
        }catch(err){
            toast.error(err.response.data.message)
        }
        finally{
            set({userLoading:false})
        }
    },
    logout: async()=>{
        try{
            const res = await axios.post(endpointUrl+'/logout',{},{withCredentials:true})
            if(res){
                set({user:null})
                window.location.href="/login"
            }
        }
        catch(err){
            toast.error(err.response.data.message)
        }
    },
    checkUser: async()=>{
        set({userCheckLoading:true})
        try{
            const res = await axios.get(endpointUrl+"/checkUser",{withCredentials:true})
            console.log("status => ", res.data.status);
            if(res.data.status){
                set({user:res.data.user})
            }
            return res.data.status
        }
        catch(err){
            console.log(err);
        }finally{
            set({userCheckLoading:false})
        }
    },
    createBlog: async(payload:object)=>{
        try{
            const res = await axios.post(endpointUrl+'/blog',payload,{withCredentials:true})
            if(res){
                toast.success(res.data.message)
            }
        }
        catch(err){
            toast.error(err.response.data.message)
        }
    },
    updateBlog: async(payload:object)=>{
        try{
            const res = await axios.post(endpointUrl+'/blog/edit',payload,{withCredentials:true})
            if(res){
                console.log(res);
            }
        }
        catch(err){
            toast.error(err.response.data.message)
        }
    },
    removeBlog: async(payload:string)=>{
        try{
            const res = await axios.post(endpointUrl+'/blog/delete',{blogId:payload},{withCredentials:true})
            if(res){
                toast.success(res.data.message)
            }
        }
        catch(err){
            toast.error(err.response.data.message)
        }
    }
}))

export default useStore