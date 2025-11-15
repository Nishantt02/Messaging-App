
"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schema/MessageSchema";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/Apiresponse";
import { useCompletion } from "@ai-sdk/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import Link from "next/link";

const initialMessageString =

  "What's your favorite movie?||If you could relive one happy memory, which one would it be?|| What’s something small that made you smile today||Do you have any pets?||What's your dream job?";
const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const Page = () => {
  const params = useParams(); // get the params from the useparams 
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // ✅ Ensure params are properly available before using
    if (params && typeof params.username === "string") {
      setUsername(params.username);
    }
  }, [params]);

  // zod valudation for the messageschema
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  // use the completion hook
  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    initialCompletion: initialMessageString,
  });

  // used to watch the content and rerender when it get change and diable the form button when no content is there
  const messageContent = form.watch("content");
  const [loading, setLoading] = useState(false);

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  //  Send message to backend
  const OnSubmit = async (data: z.infer<typeof messageSchema>) => {
    if (!username) {
      toast.error("Username not found in URL");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/send-message`, {
        ...data,
        username,
      });

      if (response.data.success) {
        // toast.success(response.data.message);
        form.reset();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={loading || !messageContent.trim()}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
         
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
