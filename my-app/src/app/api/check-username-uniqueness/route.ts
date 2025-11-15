import dbConnect from "@/lib/dbConnect";
import UserModel from "../../../models/User";
import {z} from "zod";
import { usernamevalidation } from "@/schema/Signup";


const UsernameQuerySchema=z.object({
  username:usernamevalidation
})

export async function GET(request:Request){
await dbConnect();
  try {
    // search for the params.
    const{searchParams}=new URL(request.url)
    const queryParams={
      username:searchParams.get('username')
    }
    // validate with zod
    const result= UsernameQuerySchema.safeParse(queryParams);
    console.log(result);
    // is the result is not true
    if(!result.success){
      const usernameErrors=result.error.format().username?._errors || []
      return Response.json(
        {
          success:false,
          message:"Invalid query parameter"
        },{status:400}
      )
    }

    const{username}=result.data
    // find username
    const existingVerifiedUser= UserModel.findOne({username,isverified:true})
    // not unique
    if ( await existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 200 }
       );
     }

    //  username is unique 
    return Response.json(
      {
        success: true,
        message: 'Username is unique',
     },
      { status: 200 }
    );
  } catch (error) {
    console.error("error checking ",error)
    return Response.json({
      success:false,
      message:"error checking username"
    })
  }
}