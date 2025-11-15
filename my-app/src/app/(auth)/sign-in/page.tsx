"use client";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signInschema } from "@/schema/Signin";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as  z from "zod"
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SigninPage = () => {
  const router = useRouter();

  // zod validation before submitting the data in sign-in form 
  const form = useForm({
    resolver: zodResolver(signInschema),
    defaultValues: {
      identifier:"",
      password:"",
    },
  });

  const OnSubmit = async (data: z.infer<typeof signInschema>) => {

    const response = await signIn("credentials",
       {
        // nextauth automatically redirecte the user to different page 
        // so we made it false print the data identifer and password
      redirect:false,
      identifier:data.identifier,
      password:data.password,
    });
    console.log(response);

    if (response?.error) {
      toast.error(response.error);
    } else if (response?.url) {
      toast.success("Signed in successfully!");
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} placeholder="Enter your email or username" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} placeholder="Enter your password" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Not a member yet?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
