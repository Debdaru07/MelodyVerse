import { Request, Response } from 'express';
import { ResponseClass, StatusType } from '../utils/ResponseClass';
import { prisma } from '../utils/prismaClient';

export const verifyEmail = async(req: Request, res: Response) => {
    /**
     * Handles email verification for a user.
     * 
     * This function performs the following steps:
     * 1. Retrieves the authenticated user from the request object (assumed to be set by middleware).
     * 2. Updates the `isVerified` field in the database to `true` for the authenticated user.
     * 3. Returns an HTML response confirming successful email verification.
     * 
     * @param req - Express Request object containing the authenticated user's details.
     * @param res - Express Response object used to return the verification result.
     * @returns An HTML response confirming email verification or an error message in JSON format.
     */
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