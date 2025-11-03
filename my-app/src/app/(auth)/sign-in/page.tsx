"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as  z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import { signupSchema } from "@/Schema/Signup"
import { ApiResponse } from "@/Types/Apiresponse"
import axios, { AxiosError } from "axios"
 

 const page=()=> {
  const[username,setUsername]=useState('');
  const[usernamemessage,setUsernamemessage]=useState('');
  const[ischeckingUsername,setIscheckingUsername]=useState(false)
  const[issubmitting,setIssubmitting]=useState(false)
  const debounceusername= useDebounceValue(username,3000) //it will send the request to backend at every 3 sec to avoid traffic for checking the uniqueness of the username
  const{toast}=useToast()
  const router=useRouter()
// zod implemention 

const form=useForm({
  resolver:zodResolver(signupSchema),
  defaultValues:{
    username:"",
    email:'',
    password:''
  }
})
// it is used to check the username uniqueness
useEffect(()=>{
const checkusernameuniqueness=async()=>{
  if(debounceusername)
    {
    setIscheckingUsername(true),
    setUsernamemessage('')
    try {
      
     const response= await axios.get(`/api/check-username-uniqueness?username=${debounceusername}`)
     console.log(response);
     setUsernamemessage(response.data.message)
    } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>
      setUsernamemessage(
        axiosError.response?.data.message??"Error checking username"
      )
    }
    finally{
      setIscheckingUsername(false);
    }

  }
}
checkusernameuniqueness()
},[debounceusername])

  return (
    <div>
      
    </div>
  )
}

export default page
function useToast(): { toast: any } {
  throw new Error("Function not implemented.")
}

function userRouter() {
  throw new Error("Function not implemented.")
}

