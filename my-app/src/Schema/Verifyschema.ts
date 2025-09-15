import z from "zod";

export const verifyschema=z.object({
    code:z.string().length(6,'must be atleast 6 number ')
})