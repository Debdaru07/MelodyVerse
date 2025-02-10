import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
    /**
     * Hashes a given password using bcrypt with a predefined number of salt rounds.
     *
     * @param {string} password - The plain text password to be hashed.
     * @returns {Promise<string>} - The hashed password.
     * @throws {Error} - If an error occurs during the hashing process.
     */
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error hashing password");
    }
};


export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    /**
     * Compares a plain text password with a hashed password to check if they match.
     *
     * @param {string} plainPassword - The plain text password entered by the user.
     * @param {string} hashedPassword - The hashed password stored in the database.
     * @returns {Promise<boolean>} - True if the passwords match, false otherwise.
     * @throws {Error} - If an error occurs during password comparison.
     */
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw new Error("Error comparing password");
    }
};