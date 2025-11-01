import dbconnect from "@/Lib/dbconnect";
import UserModel from "@/Lib/Models/User";
import {Message} from '@/Lib/Models/User'

export async function POST(request:Request) {
    await dbconnect();
// we can easily send the msg even if the user is not logged in.
const{username,content}=await request.json();
try {
    const user=await UserModel.findOne({username});
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


