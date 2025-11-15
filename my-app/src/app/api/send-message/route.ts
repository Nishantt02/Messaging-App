import dbConnect from "@/lib/dbConnect";
import UserModel from "../../../models/User";
import {Message} from '../../../models/User'

export async function POST(request:Request) {
    await dbConnect();
// we can easily send the msg even if the user is not logged in.
const{username,content}=await request.json();
try {
    // for this particular username it can easily send the msg to the username if it is not loginned
    const user=await UserModel.findOne({username}); // find by username
    if(!user){
        return Response.json({
            success:false,
            message:"user not found"
        },{status:404})
    }

    // is user accepting the msg  checking validation
    if(!user.isAcceptingMessages){
        return Response.json({
            success:false,
            message:'user not accepting the msg'
        },{status:401})
    }
    const newMessage={content,createdAt:new Date()}
    user.messages.push(newMessage as Message)
    await user.save();
    return Response.json({
        success:true,
        messages:user.messages
    },{status:200})
} catch (error) {
        return Response.json({
            success:false,
            message:'Internal server error'
        },{
            status:500
        })
     }


}
// this code is basically for the send of the 
// msg to the provide username even if the user is not loginned


