import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (email: string, password: string) => {
    /**
     * Sends a password reset email to the user with the new password.
     * @param email - The recipient's email address.
     * @param password - The newly generated password.
     */
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
        from: `"MelodyVerse" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Password has been reset!',
        html: `<h3>Your Password has been reset.</h3>
                <p>Use the following link to login to your account</p>
               <h2>Password:</h2><p>${password}</p>`
    };

    await transporter.sendMail(mailOptions);

    return;
}