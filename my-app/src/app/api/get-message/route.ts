import { getServerSession } from "next-auth"; // used to access user from session
import dbconnect from "@/Lib/dbconnect";
import UserModel from "@/Lib/Models/User";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";

//main purpose of this request is to get the messages of the loginned user in reverse ordrer new first
export async function GET(request:Request) {
    await dbconnect();
    const session= await getServerSession(authOptions); //get the session and data
    const user=session?.user //fetch the data from session
    if(!session || !user){
        return Response.json({
            message:"user not found"
        },{status:404})
    }
    const userid= new mongoose.Types.ObjectId(user._id) //convert id into mongoose obejct id
    try {
        const user = await UserModel.aggregate([
      { $match: { _id: userid } }, //Pick your box (your user).
      { $unwind: '$messages' }, //Take each card (each message) out of the box.
      { $sort: { 'messages.createdAt': -1 } }, // sort the message new to oldest
      { $group: { _id: '$_id', messages: { $push: '$messages' } } }, //form the grop of the msg
    ]).exec();

    if(!user || user.length===0){
        return Response.json({
            success:false,
            message:"messages not found"
        },
    {status:404})
    }

    return Response.json({
        success:true,
        message:user[0].messages

    },{status:201})
        

    } catch (error) {
          return Response.json({
            success:false,
            message:'Interval server error'
        },{
            status:500
        })
     }
    
}