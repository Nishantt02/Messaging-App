import z from "zod";

export const isAcceptingMessage=z.object({
    content:z
    .string()
    .min(10,"atleast 10 character")
})