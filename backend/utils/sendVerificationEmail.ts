import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email: string, link: string) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
        from: `"MelodyVerse" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email',
        html: `<h3>Click the link below to verify your email:</h3>
               <a href="${link}">${link}</a>`
    };

    await transporter.sendMail(mailOptions);
};