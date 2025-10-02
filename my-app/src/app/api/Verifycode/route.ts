import dbconnect from "@/Lib/dbconnect";
import UserModel from "@/Models/User";
import { date, success } from "zod";

export async function POST(request:Request){
    await dbconnect()

    try {
        
        const{username,code}=await request.json()
        const decodedusername=decodeURIComponent(username)
        const user=await UserModel.findOne({username:decodedusername})
        if(!user){
            return Response.json({
                success:"500",
                message:"user not found"
            })
        }

        const isvalidcode= await user.verifycode===code
        const iscodeexpiry=new Date(user.verifycodeexpiry)> new date()

        if(isvalidcode && iscodeexpiry){
            user.isVerified=true;
            await user.save();
            return Response.json({
                success:"200",
                message:"user is verified"
            },{status:200})
            
        }
        else if(!iscodeexpiry){
            return Response.json({
                success:false,
                message:"code expires"
            },{status:400})
        } 
        else if(!isvalidcode){
            return Response.json({
                success:false,
                message:"code is not valid"
            },{status:400})
        }

    } catch (error) {
        console.error('error in verifying code',error)
        return Response.json({
            success:false,
            message:"error in checking username"
        },{
            status:500
        })
    }
}