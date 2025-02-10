import { Request, Response } from 'express';
import { ResponseClass, StatusType } from '../utils/ResponseClass';
import { signUpSchema } from '../zod/signupSchema';
import { prisma } from '../utils/prismaClient';
import { hashPassword } from '../utils/hashPassword';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/sendVerificationEmail';
import { generateJWT } from '../utils/auth';
const signUp = async (req: Request, res: Response) => { 
    /**
     * Handles user registration (sign-up) process.
     * 
     * This function performs the following steps:
     * 1. Validates the incoming request body using `signUpSchema` to ensure proper input format.
     * 2. Checks if a user with the provided `username` or `email` already exists in the database (case-insensitive email check).
     * 3. If a user already exists, returns an error response.
     * 4. Hashes the provided password for secure storage.
     * 5. Creates a new user in the database with the provided `name`, `username`, `email`, and hashed password.
     * 6. Generates a JWT token for email verification and constructs a verification link.
     * 7. Attempts to send a verification email to the user's email address.
     * 8. Generates an access token for the newly created user.
     * 9. Returns a success response with the generated access token.
     * 
     * @param req - Express Request object containing `username`, `password`, `name`, and `email` in the request body.
     * @param res - Express Response object used to return the registration result.
     * @returns A JSON response with an access token (on success) or an error message (on failure).
     */
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