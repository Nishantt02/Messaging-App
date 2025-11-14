import z from "zod";

export const messageschema=z.object({
    content:z
    .string()
    .min(10,"atleast 10 character")
})