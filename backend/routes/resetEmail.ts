import { Request, Response } from 'express';
import { ResponseClass, StatusType } from '../utils/ResponseClass';
import { prisma } from '../utils/prismaClient';
import { resetPasswordSchema } from '../zod/resetEmailSchema';
import { generateSecurePassword } from "../utils/generatePassword";
import { sendResetPasswordEmail } from '../utils/sendResetPasswordEmail';
import { hashPassword } from '../utils/hashPassword';

export const resetPassword = async(req: Request, res: Response) => {
    /**
     * Handles the password reset process for a user.
     * 
     * This function performs the following steps:
     * 1. Validates the incoming request body against the `resetPasswordSchema`.
     * 2. Checks if the user with the provided email exists in the database.
     * 3. If the user exists, generates a new secure password.
     * 4. Hashes the generated password and updates the user's password in the database.
     * 5. Sends a reset password email to the user with the new password.
     * 6. Returns a success or failure response based on the outcome of the operations.
     * 
     * @param req - Express Request object containing the user's email in the request body.
     * @param res - Express Response object used to send a response back to the client.
     */

    try{
        const parsedInput = resetPasswordSchema.safeParse(req.body);

        if(!parsedInput.success){
            return res.json(new ResponseClass({ error: parsedInput.error }, "ERR3", StatusType.Fail));
        }
        const { email } = parsedInput.data;
        const user = await prisma.user.findFirst({
            where: {
                email
            },
        })
        if(!user){
            return res.json(new ResponseClass({}, "ERR9", StatusType.Fail))
        }

        const password = generateSecurePassword()
        const hashedPassword = await hashPassword(password);
        const update =  await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: hashedPassword
            }
        })
        console.log("user", update)
        if(!update.email){
            throw new Error("ERR2")
        }

        try{
            await sendResetPasswordEmail(email, password) 
        }catch(err){
            console.log("error", err)
        }
        return res.json(new ResponseClass({}, "MSG2" , StatusType.Success));
        
    }catch(error){
        console.error("Reset Password Error:", error);
        
        return res.json(new ResponseClass({}, "ERR2" , StatusType.Fail));
    }
}