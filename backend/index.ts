import express from 'express';
import signUp from './routes/signUp';
import signIn from './routes/signIn';

import "./config";
import { verifyEmail } from './routes/verifyEmail';
import { verifyJWT } from './middleware/verifyToken';
import cors from 'cors';
import { resetPassword } from './routes/resetEmail';
const app = express();

app.use(express.json());
app.use(cors())

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