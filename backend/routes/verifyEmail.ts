import { Request, Response } from 'express';
import { ResponseClass, StatusType } from '../utils/ResponseClass';
import { verifyEmailSchema } from '../zod/verifyEmailSchema';
import { prisma } from '../utils/prismaClient';

// const parsedInput = verifyEmailSchema.safeParse(req.body);
// if(!parsedInput.success){
//     return res.json(new ResponseClass({ error: parsedInput.error }, "ERR3", StatusType.Fail));
// }
export const verifyEmail = async(req: Request, res: Response) => {
    try{

        const user = (req as any).user;
        console.log('user in aoi', user)
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isVerified: true
            }
        })
        console.log('reached here')
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Verified - MelodyVerse</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        background-color: #f4f4f4;
                        padding: 50px;
                    }
                    .container {
                        background: white;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                        display: inline-block;
                    }
                    h1 {
                        color: #4CAF50;
                    }
                    p {
                        color: #333;
                    }
                    .button {
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                        margin-top: 15px;
                    }
                    .button:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>✅ Account Verified!</h1>
                    <p>Thank you for verifying your email. You may now log in to MelodyVerse and explore the music world!</p>
                    
                </div>
            </body>
            </html>
        `);

        
    }catch(error){
        console.error("Signup Error:", error);
        
        return res.json(new ResponseClass({}, "ERR2" , StatusType.Fail));
    }
}