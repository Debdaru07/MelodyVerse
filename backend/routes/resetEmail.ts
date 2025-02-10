import { Request, Response } from 'express';
import { ResponseClass, StatusType } from '../utils/ResponseClass';
import { prisma } from '../utils/prismaClient';
import { resetPasswordSchema } from '../zod/resetEmailSchema';
import { generateSecurePassword } from "../utils/generatePassword";
import { sendResetPasswordEmail } from '../utils/sendResetPasswordEmail';
import { hashPassword } from '../utils/hashPassword';

export const resetPassword = async(req: Request, res: Response) => {
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

        await sendResetPasswordEmail(email, password) 
        return res.json(new ResponseClass({}, "MSG2" , StatusType.Success));
        
    }catch(error){
        console.error("Reset Password Error:", error);
        
        return res.json(new ResponseClass({}, "ERR2" , StatusType.Fail));
    }
}