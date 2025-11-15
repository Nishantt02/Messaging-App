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
import { Message } from "../models/User"
import axios,{AxiosError} from "axios"
import dayjs from 'dayjs';
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
import { X } from "lucide-react"

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
           toast.success(response.data.message)
            onMessageDelete(message._id);
    }
   
     catch (error:any) {
       toast.error(error?.response?.data?.message || 'error in delecting the message')
    }
}
 
    return(
      <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={HandledeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
export default Mastercard

