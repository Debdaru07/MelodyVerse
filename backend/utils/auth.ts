import jwt from 'jsonwebtoken';

export function generateJWT(userId: string) {
    /**
     * Generates a JSON Web Token (JWT) for user authentication.
     * 
     * This function creates a signed JWT containing:
     * - `userId`: The unique identifier of the user.
     * - `lastActivity`: A timestamp indicating when the token was generated.
     * 
     * The token is signed using a secret key and is set to expire in 1 day.
     * 
     * @param userId - The unique identifier of the user.
     * @returns A signed JWT as a string.
     */


    const secret = process.env.JWT_SECRET || "Random pass";

    const token = jwt.sign(
        { 
            userId, 
            lastActivity: Date.now() 
        }, 
        secret, 
        { 
            expiresIn: '1d' 
        }
    );
    return token;
}