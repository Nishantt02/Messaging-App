import z from "zod";

export const isAcceptingMessage=z.object({
    acceptMeaage:z.boolean()
})