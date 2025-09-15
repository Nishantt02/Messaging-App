import z from "zod";

export const usernamevalidation=z
.string()
.min(2,'Usrename must be greater than 2 character')
.max(20,'Usrename must be less than 20 character')

export const signupSchema=z.object({
    username:usernamevalidation,
    email:z.email({message:"Invalid email address"}),
    password:z.string().min(5,{message:"must be 5 character"})
})
