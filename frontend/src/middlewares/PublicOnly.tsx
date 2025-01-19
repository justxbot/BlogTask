import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

export default function PublicOnly({children}) {
    const navigate = useNavigate()
    const checkUser = useStore((state:any)=>state.checkUser)
    const [loadingContent,setLoadingContent] = useState<boolean>(true)
    const handleRedirects = async()=>{
        const res =  await checkUser()       
        if(res){
            navigate("/")
        }
        else{
            setLoadingContent(false)
        }
    }
    useEffect(()=>{
        handleRedirects()
    },[])
  return (
    loadingContent?
    <></>
    :
    children
  )
}
