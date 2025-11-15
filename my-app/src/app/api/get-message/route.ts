import { getServerSession } from "next-auth"; // used to access user from session
import dbConnect from "@/lib/dbConnect";
import UserModel from "../../../models/User";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";

//main purpose of this request is to get the messages of the loginned user in reverse ordrer new first
export async function GET(request:Request) {
    await dbConnect();
    const session= await getServerSession(authOptions); //get the session and data
    const user=session?.user //fetch the loginuser data from session
    
    console.log("session",session)
    if(!session || !user){
        return Response.json({
            message:"user not found"
        },{status:404})
    }
    const userid= new mongoose.Types.ObjectId(user._id) //convert id into mongoose object id
    console.log(userid)
    const checkUser = await UserModel.findById(userid);
console.log("Found user in DB:", checkUser);

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
        messages:user[0].messages

    },{status:200})
        

    } catch (error) {
          return Response.json({
            success:false,
            message:'Interval server error'
        },{
            status:500
        })
     }
    
}
