import dbConnect from "@/lib/dbConnect";
import UserModel from "../../../../models/User";
import { getServerSession } from "next-auth"; // used to access user from session
import { authOptions } from "../../auth/[...nextauth]/option";

 export async function DELETE(request:Request,
    context: { params: Promise<{ messageid: string }> } ) // this is the dynamic routing
 {
    await dbConnect();
    const{messageid}=await context.params  // get the messgeid from the params dynamic routing
    const session= await getServerSession(authOptions); // get the session from authOption
    const user=session?.user // get the loginuser data from the session
    if(!session || !user){
        return Response.json({
            success:false,
            message:'user not found'
        },{status:401})
    }

    try {
        
        const updateresult=await UserModel.updateOne(
            {_id:user._id} , // here used to find the user on basis of the _id 

            {$pull:{messages:{_id:messageid}}}   
            //detele the message on the basis of the 
            // id by using mongodb pull opertion

        ) 
                console.log(updateresult);

        if(updateresult.modifiedCount===0){
            return Response.json({
                sucess:false,
                message:" not found or already deleted"
            },{status:404})

        }
        return Response.json({
            success:true,
            message:"message deleted successfully"
        },{status:201})
    } catch (error) {
        console.log("error in code",error)
        return Response.json({
            success:false,
            message:'Internal server error'
        } ,{status:500})
    }
 }