import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../views/Login'
import useStore from '../store/useStore'
import Signup from '../views/Signup'
import Blogs from '../views/Blogs'
import MyBlogs from '../views/MyBlogs'
import CreateBlog from '../views/CreateBlog'
import SingleBlog from '../views/SingleBlog'
import EditBlog from '../views/EditBlog'
import PublicOnly from '../middlewares/PublicOnly'
import ProtectedOnly from '../middlewares/ProtectedOnly'
import NotFound from '../views/NotFound'

export default function Router() {

  const checkUser = useStore((state:any)=>state.checkUser)

  useEffect(()=>{
      checkUser()
  },[])
  return (
    <Routes>
       <Route path='/' element={<ProtectedOnly><Blogs /></ProtectedOnly>}></Route>
       <Route path='/login' element={<PublicOnly><Login /></PublicOnly>}></Route>
       <Route path='/signup' element={<PublicOnly><Signup /></PublicOnly>}></Route>
       <Route path='/myblogs' element={<ProtectedOnly><MyBlogs /></ProtectedOnly>}></Route>
       <Route path='/myblogs/create' element={<ProtectedOnly><CreateBlog /></ProtectedOnly>}></Route>
       <Route path='/blogs/:id' element={<ProtectedOnly><SingleBlog /></ProtectedOnly>}></Route>
       <Route path='/myblogs/edit/:id' element={<ProtectedOnly><EditBlog /></ProtectedOnly>}></Route>
       <Route path='/*' element={<NotFound/>}></Route>
    </Routes>
  )
}
