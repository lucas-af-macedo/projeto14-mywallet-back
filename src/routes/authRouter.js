import express from 'express';
import {signUp, signIn} from '../controllers/authController.js';
import {signUpValidation, signInValidation} from '../Middlewares/authValidationMiddlewares.js';

const authRouter = express.Router();
authRouter.post ('/sign-up', signUpValidation, signUp);
authRouter.post ('/sign-in', signInValidation, signIn);
export default authRouter;