// "use client"
// import { useCallback, useEffect, useState } from "react"
// import { Message } from "@/lib/Models/User"
// import { toast } from 'sonner';
// import { useSession } from "next-auth/react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod"
// import { isAcceptingMessage } from "@/Schema/Acceptmessage";
// import axios,{AxiosError} from "axios";
// import { ApiResponse } from "@/Types/Apiresponse";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
// import { Loader2, RefreshCcw } from "lucide-react";
// import Mastercard from '@/components/messagecard'

// const Page=()=>{
// const[messages,setMessages]=useState<Message[]>([]); // get all messages array of message
// const[loading,setloading]=useState(false);
// const[IsSwitching,setIsSwitching]=useState(false)

//   function Handledeletemessage(messageId: string) {
//     setMessages(messages.filter((message) => message._id != messageId));
//   }
// // get the data from the session
// const{data:session}=useSession();


// const form = useForm({
//   resolver: zodResolver(isAcceptingMessage),
//   defaultValues: { acceptingMessages: false }
// })

// const { watch, register, setValue } = form;
// const acceptingMessages = watch("acceptingMessages");


// // frontend for the GET method check accepting messageing or not
// const fetchAcceptmessage=useCallback(async()=>{
//   setIsSwitching(true)
//   try {
//     const response=await axios.get(`/api/accept-message`)
//     // setValue('acceptMeaage', response.data.isAcceptingMessages)
//     setValue('acceptingMessages', response.data.isAcceptingMessages)

//     // toast.success(response.data.message)
//   } catch (error) {
//      const axiosError=error as AxiosError<ApiResponse>
//       let errormessage=axiosError.response?.data.message
//       toast.error(errormessage);
//   }
//   finally{
//     setIsSwitching(false);
//   }
// },[setValue])


// // this is the request for the get message from the user//
// const fetchmessage=useCallback(async(refresh:boolean=false)=>{
// try {
//   setloading(true);
//   // setIsSwitching(false)
  
//   const response=await axios.get(`/api/get-message`)
//   setMessages(response.data.messages|| [])
//   // toast.success(response.data.message)
//   if(refresh){
//     toast.success(response.data.message || "Showing latest Messages")
//   }
// } catch (error) {
//       const axiosError=error as AxiosError<ApiResponse>
//       let errormessage=axiosError.response?.data.message
//       toast.error(errormessage);
// }finally{
//   setIsSwitching(false)
//   setloading(false)
// }
// },[setMessages,toast])



// useEffect(()=>{

//   if(!session || !session.user){
//   toast.error('no data found in session')
//     return
//   }
// fetchAcceptmessage()
// fetchmessage()
// },[session,toast,setValue,fetchAcceptmessage,fetchmessage])


// // handle switch change 
// const HandleswitchChange = async () => {
//   try {
//     const response = await axios.post(`/api/accept-message`, {
//       acceptingMessages: !acceptingMessages,
//     });
//     setValue("acceptMeaage", !acceptingMessages); 
//     toast.success(response.data.message);
//   } catch (error) {
//     const axiosError = error as AxiosError<ApiResponse>;
//     let errormessage = axiosError.response?.data.message;
//     toast.error(errormessage);
//   } 
// };

// const username = session?.user?.username;
//   const [profileUrl, setProfileUrl] = useState("");

//   useEffect(() => {
//     if (typeof window !== "undefined" && username) {
//       const baseurl = `${window.location.protocol}//${window.location.host}`;
//       setProfileUrl(`${baseurl}/u/${username}`);
//     }
//   }, [username]);

//    const copyToClipboard = () => {
//     navigator.clipboard.writeText(profileUrl);
//     toast.success("URL copied to clipboard");
//   };
//   if(!session || !session.user){
//   return <>login agian</>
// }

// return (
//     <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
//       <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

//       <div className="mb-4">
//         <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
//         <div className="flex items-center">
//           <input
//             type="text"
//             value={profileUrl}
//             disabled
//             className="input input-bordered w-full p-2 mr-2"
//           />
//           <Button onClick={copyToClipboard}>Copy</Button>
//         </div>
//       </div>

// <Switch
//   {...register("acceptMeaage")}
//   checked={acceptingMessages} // convert undefined → false
//   onCheckedChange={HandleswitchChange}
//   disabled={IsSwitching}
// />
// <span className="ml-2">
//   Accept Messages: {acceptingMessages ? "On" : "Off"}
// </span> 


//       <Separator />

//       <Button
//         className="mt-4"
//         variant="outline"
//         onClick={(e) => {
//           e.preventDefault();
//           fetchmessage();
//         }}
//       >
//         {loading ? (
//           <Loader2 className="h-4 w-4 animate-spin" />
//         ) : (
//           <RefreshCcw className="h-4 w-4" />
//         )}
//       </Button>
//       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//         {messages.length > 0 ? (
//           messages.map((message, index) => (
//             <Mastercard
//               key={message._id}
//               message={message}
//               onMessageDelete={Handledeletemessage}
//             />
//           ))
//         ) : (
//           <p>No messages to display.</p>
//         )}
//       </div>
//     </div>
//   );

// }
// export default Page

"use client";
import { useCallback, useEffect, useState } from "react";
import { Message } from "../../../models/User";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAcceptingMessage } from "@/schema/Acceptmessage";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/Apiresponse";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import Mastercard from "@/components/messagecard";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]); // get the data message from the db
  const [loading, setLoading] = useState(false);  // used for the refresh of the button
  const [isSwitching, setIsSwitching] = useState(false);

  // get the data from the session
  const { data: session } = useSession();
  

  // ------------------- FORM SETUP -------------------
  // zod validation for the accepting messages
  const form = useForm({
    resolver: zodResolver(isAcceptingMessage),
    defaultValues: { acceptingMessages: false },
  });

  // setvalue is programmtically update the value of the form when recieve result
  const { watch, register, setValue } = form;
  const acceptingMessages = watch("acceptingMessages");
// watch provides the current value of acceptingMessages, re-rendering when it changes.
  // Delete message locally
  function handleDeleteMessage(messageId: string) {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
  }

  // ------------------- GET ACCEPT-MESSAGE STATUS of the USER -------------------
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitching(true);
    try {
      const response = await axios.get(`/api/accept-message`);
      setValue("acceptingMessages", response.data.isAcceptingMessages); 
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSwitching(false);
    }
  }, [setValue]);

  // ------------------- GET ALL MESSAGES -------------------
  const fetchMessages = useCallback(async (refresh = false) => {
    try {
      setLoading(true);

      const response = await axios.get(`/api/get-message`);
      setMessages(response.data.messages || []);

      if (refresh) {
        toast.success(response.data.message || "Showing latest messages");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------------- INITIAL LOAD -------------------
  useEffect(() => {
    if (!session || !session.user) {
      toast.error("No session found.");
      return;
    }

    fetchAcceptMessage();
    fetchMessages();
  }, [session, fetchAcceptMessage, fetchMessages]);

  // ------------------- HANDLE SWITCH -------------------
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post(`/api/accept-message`, {
        acceptingMessages: !acceptingMessages,
      });

      setValue("acceptingMessages", !acceptingMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };

  // ------------------- PROFILE URL -------------------
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
    toast.success("URL copied!");
  };

  if (!session || !session.user) {
    return <>Login Again</>;
  }

  // ------------------- UI -------------------
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      {/* UNIQUE LINK */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
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

      {/* SWITCH */}
      <Switch
        {...register("acceptingMessages")}
        checked={!!acceptingMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitching}
      />
      <span className="ml-2">
        Accept Messages: {acceptingMessages ? "On" : "Off"}
      </span>

      <Separator />

      {/* REFRESH BUTTON */}
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      {/* MESSAGES LIST */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <Mastercard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
