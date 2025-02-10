import { Request, Response } from 'express';
import { ResponseClass, StatusType } from '../utils/ResponseClass';
import { signInSchema } from '../zod/signInSchema';
import { prisma } from '../utils/prismaClient';
import { comparePassword } from '../utils/hashPassword';
import { generateJWT } from '../utils/auth';

const signIn = async (req: Request, res: Response) => { 
    /**
     * Handles user sign-in authentication.
     * 
     * This function performs the following steps:
     * 1. Validates the incoming request body using `signInSchema` to ensure proper input format.
     * 2. Searches for a user in the database by checking if the provided `username` matches either the `username` or `email` (case-insensitive).
     * 3. If the user does not exist, returns an error response.
     * 4. If the user exists but does not have a stored password, returns an error response.
     * 5. Compares the provided password with the hashed password stored in the database.
     * 6. If the passwords do not match, returns an error response.
     * 7. If authentication is successful, generates a JWT access token for the user.
     * 8. Responds with the access token and the user's verification status.
     * 
     * @param req - Express Request object containing `username` and `password` in the request body.
     * @param res - Express Response object used to return the authentication result.
     * @returns A JSON response with either an access token and verification status (on success) or an error message (on failure).
     */
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