import express from 'express';
import signUp from './routes/signUp';
import signIn from './routes/signIn';

import "./config";
import { verifyEmail } from './routes/verifyEmail';
import { verifyJWT } from './middleware/verifyToken';
import cors from 'cors';
import { resetPassword } from './routes/resetEmail';

const app = express();

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again later.",
    headers: true, // Include rate limit headers
});


app.use(express.json());
app.use(cors())
app.use(limiter);

// @ts-expect-error
app.post('/signup', signUp);

// @ts-expect-error
app.post('/signin', signIn);

// @ts-expect-error
app.get('/verify-email', verifyJWT, verifyEmail);

// @ts-expect-error
app.post('/reset-email', resetPassword);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});