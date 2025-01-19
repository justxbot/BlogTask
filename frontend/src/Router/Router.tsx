import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../views/Login'
import useStore from '../store/useStore'
import Signup from '../views/Signup'
import Blogs from '../views/Blogs'
import MyBlogs from '../views/MyBlogs'
import CreateBlog from '../views/CreateBlog'
import SingleBlog from '../views/SingleBlog'

export default function Router() {

  const checkUser = useStore((state:any)=>state.checkUser)

  useEffect(()=>{
      checkUser()
  },[])
  return (
    <Routes>
       <Route path='/login' element={<Login/>}></Route>
       <Route path='/signup' element={<Signup/>}></Route>
       <Route path='/' element={<Blogs/>}></Route>
       <Route path='/myblogs' element={<MyBlogs/>}></Route>
       <Route path='/myblogs/create' element={<CreateBlog/>}></Route>
       <Route path='/blogs/:id' element={<SingleBlog/>}></Route>
    </Routes>
  )
}
