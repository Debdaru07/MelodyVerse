import { Request, Response } from 'express';
import { ResponseClass, StatusType } from '../utils/ResponseClass';
import { signInSchema } from '../zod/signInSchema';
import { prisma } from '../utils/prismaClient';
import { comparePassword } from '../utils/hashPassword';
import { generateJWT } from '../utils/auth';

const signIn = async (req: Request, res: Response) => { 
    try {
        const parsedInput = signInSchema.safeParse(req.body);

        if(!parsedInput.success){
            return res.json(new ResponseClass({ error: parsedInput.error }, "ERR3", StatusType.Fail));
        }
        console.log("api hit")
        const { username, password } = parsedInput.data;

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    {email: {
                        equals: username,
                        mode: 'insensitive'
                    }}
                ]
            },
            select: {
                userId: true,
                password: true,
                isVerified: true
            }
        })
        if(!user){
            return res.json(new ResponseClass({}, "ERR6" , StatusType.Fail));
        }
        if(!user?.password){
            return res.json(new ResponseClass({}, "ERR2" , StatusType.Fail));
        }
        
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.json(new ResponseClass({}, "ERR7" , StatusType.Fail));
        }
        const accessToken = user?.userId && generateJWT(user?.userId)

        return res.json(new ResponseClass({ 
            accessToken,
            isVerified: user?.isVerified
         }, "MSG1" , StatusType.Success));

    } catch (error) {
        console.error("Signup Error:", error);
        
        return res.json(new ResponseClass({}, "ERR2" , StatusType.Fail));
    }
}

export default signIn;