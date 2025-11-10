"use client"

import { useCallback, useEffect, useState } from "react"
import { Message } from "@/lib/Models/User"
import { toast } from 'sonner';
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { isAcceptingMessage } from "@/Schema/MessageSchema";
import axios,{AxiosError} from "axios";
import { ApiResponse } from "@/Types/Apiresponse";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import Mastercard from '@/components/messagecard'

const Page=()=>{
const[messages,setmessages]=useState<Message[]>([]); // get all messages array of message
const[loading,setloading]=useState(false);
const[isswitching,setisswitching]=useState(false)

  function Handledeletemessage(messageId: string) {
    setmessages(messages.filter((message) => message._id != messageId));
  }
// get the data from the session
const{data:session}=useSession();


// zod validation for the messages
const form=useForm({
  resolver:zodResolver(isAcceptingMessage),
  defaultValues: { isAcceptingMessage: false }
})

const{watch,register,setValue}=form;
// const acceptmessage=watch('isAcceptingMessage')
// const acceptmessage = watch('isAcceptingMessage')
const acceptmessage = watch("isAcceptingMessage")


// frontend for the GET method check accepting messageing or not
const fetchAcceptmessage=useCallback(async()=>{
  setloading(true);
  try {
    const response=await axios.get(`/api/accept-message`)
    // setValue('acceptmessage',response.data.isAcceptingMessages)
    setValue('isAcceptingMessage', response.data.isAcceptingMessages)
    toast.success(response.data.message)
  } catch (error) {
     const axiosError=error as AxiosError<ApiResponse>
      let errormessage=axiosError.response?.data.message
      toast.error(errormessage);
  }
  finally{
    setloading(false);
  }
},[setValue])
// it is the POST request for fetching of the message

const fetchmessage=useCallback(async()=>{
try {
  setloading(true);
  const response=await axios.get(`/api/accept-message`)
  setmessages(response.data.message|| [])
  toast.success(response.data.message)
} catch (error) {
      const axiosError=error as AxiosError<ApiResponse>
      let errormessage=axiosError.response?.data.message
      toast.error(errormessage);
}finally{
  setloading(false)
}
},[setmessages])

useEffect(()=>{

  if(!session || !session.user){
  toast.error('no data found in session')
    return
  }
fetchAcceptmessage()
fetchmessage()
},[session,fetchAcceptmessage,fetchmessage])


// handle switch change 
const HandleswitchChange = async () => {
  try {
    setisswitching(true);
    const response = await axios.post(`/api/accept-message`, {
      acceptmessage: !acceptmessage,
    });
    // setValue("isAcceptingMessage", !acceptmessage);
    setValue("isAcceptingMessage", !acceptmessage); 
    toast.success(response.data.message);
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    let errormessage = axiosError.response?.data.message;
    toast.error(errormessage);
  } finally {
    setisswitching(false);
  }
};

// handle switch change 
// const HandleswitchChange=async()=>{
// try {
//   const response=await axios.post(`/api/accept-message`,{
//     acceptmessage:!acceptmessage
//   })
//   // setValue('acceptmessage',!acceptmessage)
//   setValue('acceptmessage',!acceptmessage)

//   toast.success(response.data.message)
 
// } catch (error) {
//    const axiosError=error as AxiosError<ApiResponse>
//       let errormessage=axiosError.response?.data.message
//       toast.error(errormessage);
// }
// }
// const{username}=session?.user
// const baseurl=`${window.location.protocol}//${window.location.host}`
// const profileurl=`${baseurl}/u/${username}`

// const copyToClipboard=()=>{
//   navigator.clipboard.writeText(profileurl);
//   toast.success('url copy to clipboard')
// }
// if(!session || !session.user){
//   return <>login agian</>
// }

const username = session?.user?.username;
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && username) {
      const baseurl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseurl}/u/${username}`);
    }
  }, [username]);

   const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL copied to clipboard");
  };

return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      {/* <div className="mb-4">
        <Switch
          {...register('isAcceptingMessage')}
          checked={acceptmessage}
          onCheckedChange={HandleswitchChange}
          disabled={isswitching}
        />
        <span className="ml-2">
          Accept Messages: {acceptmessage ? 'On' : 'Off'}
        </span>
      </div> */}

  

<Switch
  {...register("isAcceptingMessage")}
  checked={!!acceptmessage} // convert undefined → false
  onCheckedChange={HandleswitchChange}
  disabled={isswitching}
/>
<span className="ml-2">
  Accept Messages: {acceptmessage ? "On" : "Off"}
</span> 


      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchmessage();
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <Mastercard
              key={message._id}
              message={message}
              onMessageDelete={Handledeletemessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );

}
export default Page