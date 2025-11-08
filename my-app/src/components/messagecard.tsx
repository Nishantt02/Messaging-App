"use client"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Button} from '@/components/ui/button'
import {toast} from 'sonner'
import { Message } from "@/lib/Models/User"
import axios,{AxiosError} from "axios"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// it define what data component expected
type MessagecardProps={
    message:Message
    onMessageDelete: (messageId: string) => void;
}


const Mastercard=({message,onMessageDelete}:MessagecardProps)=>{
    
//  this is the method create for the delete of the message 
 // get the string 

 const HandledeleteConfirm=async()=>{
    try {
         const response=await axios.delete(`/api/delete-message/${message._id}`)
           toast.success(response.data.message);
    }
     catch (error:any) {
       toast.error(error?.response?.data?.message || 'error in delecting the message')
    }
}
 
    return(
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-5 h-5">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={HandledeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>Card Description</CardDescription>

  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
    )
}
export default Mastercard

function onMessagedelete(response: any) {
    throw new Error("Function not implemented.")
}
