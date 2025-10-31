import { getServerSession } from "next-auth"; // used to access user from session
import dbconnect from "@/Lib/dbconnect";
import UserModel from "@/Lib/Models/User";
import { authOptions } from "../auth/[...nextauth]/option";

// post request and the main purpose of this code is to enable and disable of accepting message
export async function POST(request:Request){
    await dbconnect();
    const session=await getServerSession(authOptions); // here get the session
    
     const user=session?.user  // get the user data from the session
     if(!session || !session.user){
        return Response.json({
            success:false,
            message:"user not found"
        },
        {status:401})
     }
     const userId=user._id || user.id; // get the userid from the user
     const{acceptingMessages}=await request.json();

     try {
        const updateUser=await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages:acceptingMessages
            },
            {
                new:true
            }
        )
        if(!updateUser){
            return Response.json({
                success:false,
                message:"user not update"
            },{status:404})
        }

        return Response.json({
            success:true,
            message:"user update successfully"
        },{status:201})
     } 
     
     catch (error) {
        console.log('failed to update the user to accepted the message')
        return Response.json({
            success:false,
            message:'failed to update the user to accepeted the message'
        },{
            status:500
        })
     }
}

//it is the get request for the getting of the status.
// of enable and diable wheater it is enable or diable
export async function GET(request:Request){
     await dbconnect();
    const session=await getServerSession(authOptions); // here get the session and data in session
    
     const user=session?.user // get the user data from the session
     if(!session || !session.user){
        return Response.json({
            success:false,
            message:"user not found"
        },
        {status:401})
     }
     const userId=user._id || user.id; // get the userid from the user
     try {
        // find the user by userid
        const founduser=await UserModel.findById(userId)
        if(!founduser){
           return Response.json({
               success:false,
               message:"failed to update the  user"
           },{status:404})
        }
        return Response.json({
           success:true,
               isAcceptingMessages:founduser.isAcceptingMessages
        },{status:201})
   
     } catch (error) {
         console.log('failed to update the user ')
        return Response.json({
            success:false,
            message:'failed to update the user'
        },{
            status:500
        })
     }
     
}