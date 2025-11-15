"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as  z from "zod"
import Link from "next/link"
import { SetStateAction, useEffect, useState } from "react"
import { useRouter } from 'next/navigation';
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from 'sonner';
import { signupSchema } from "@/schema/Signup"
import { ApiResponse } from "@/types/Apiresponse"
import axios, { AxiosError } from "axios"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
 

 const page=()=> {
  const[username,setUsername]=useState('');
  const[usernamemessage,setUsernamemessage]=useState('');
  const[ischeckingUsername,setIscheckingUsername]=useState(false)
  const[issubmitting,setIssubmitting]=useState(false)
  const router=useRouter()

  // usecallback works on the function to delays
const debounceusername= useDebounceCallback(setUsername,3000) 
  //it will send the request to backend at every 3 sec to avoid traffic for checking the uniqueness of the username
// zod implemention checking the zod validation and default value of the feilds 
const form=useForm({
  resolver:zodResolver(signupSchema),
  // set the default values 
  defaultValues:{
    username:"",
    email:'',
    password:''
  }
})
// it is used to check the username uniqueness
useEffect(()=>{
const checkusernameuniqueness=async()=>{
  if(username) // if it corrected happen then return 
    {
    setIscheckingUsername(true); // means username is unique checked done
    setUsernamemessage('') // here send the data or messsage
    try {
      
     const response= await axios.get(`/api/check-username-uniqueness?username=${username}`)
     console.log(response.data.message);
    //  setUsernamemessage(response.data.message)
    let message=response.data.message
    setUsernamemessage(message);  // here send the message to the username...

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
},[username])
// it will run only when the debounceusername changes 

// here is the logic for the submitting of the signup form 
const onSubmit = async (data: z.infer<typeof signupSchema>) => //zod validation in data it contain all fields
  { 
  // handle signup logic here for the submitting of the form 
  setIssubmitting(true) // here it is true means it is submitting the form
  try {
    const response=await axios.post(`/api/sign-up`,data)
    console.log(response)
     toast.success(response.data.message || "Signup successful! 🎉")
    router.replace(`/verify/${data.username}`)
    //navigate to the verifying page and it is added in the url which username is need to verify
    setIssubmitting(false) // form submitted so false
  } 
    catch (error) 
    {
      console.error("error in signup of user",error)
      const axiosError=error as AxiosError<ApiResponse>
      let errormessage=axiosError.response?.data.message
       toast.error(errormessage)
      setIssubmitting(false);
    }
};

 return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
{/* this is the form field for the username  */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e: { target: { value: SetStateAction<string> } }) => {
                      field.onChange(e);
                      debounceusername(e.target.value);
                    }}
                  />
                  {ischeckingUsername && <Loader2 className="animate-spin" />}
                  {!ischeckingUsername && usernamemessage && (
                    <p
                      className={`text-sm ${
                        usernamemessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernamemessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* this is the form field for the email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-muted text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />
{/* this is the form field for the password  */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* here we have create the button for the submitting of the form  */}
             {/* here if issubmitting is true then it show the loader else sign */}

            <Button type="submit" className='w-full' disabled={issubmitting}>
              {issubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page

