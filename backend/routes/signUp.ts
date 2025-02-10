import { Request, Response } from 'express';
import { ResponseClass, StatusType } from '../utils/ResponseClass';
import { signUpSchema } from '../zod/signupSchema';
import { prisma } from '../utils/prismaClient';
import { hashPassword } from '../utils/hashPassword';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/sendVerificationEmail';
import { generateJWT } from '../utils/auth';
const signUp = async (req: Request, res: Response) => { 
    try {
        const parsedInput = signUpSchema.safeParse(req.body);
        
        if(!parsedInput.success){
            return res.json(new ResponseClass({ error: parsedInput.error }, "ERR3", StatusType.Fail));
        }
        
        const { username, password, name, email } = parsedInput.data;
        
        const isUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {username},
                    {email: {
                        equals: email,
                        mode: 'insensitive'
                    }}
                ]
            }
        })
        
        if(isUser){
            return res.json(
                new ResponseClass({}, "ERR5", StatusType.Fail)
            )
        }
        
        const hashedPassword = await hashPassword(password);
        console.log('hashedPassword', hashedPassword)
        const user = await prisma.user.create({
            data: {
                name,
                username,
                password: hashedPassword,
                email,
            },
            select: {
                name: true,
                username: true,
                email: true,
                userId: true
            }
        })
        
        const secret = process.env.JWT_SECRET || "Random pass";
        const token = jwt.sign({ email, }, secret, { expiresIn: '1h' } );
        
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
        
        try {
            await sendVerificationEmail(email, verificationLink);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }

        const accessToken = user?.userId && generateJWT(user?.userId)
        return res.json(new  ResponseClass({ accessToken }, "MSG1" , StatusType.Success));

    } catch (error) {
        console.error("Signup Error:", error);
        
        return res.json(new ResponseClass({}, "ERR2" , StatusType.Fail));
    }
}

export default signUp;