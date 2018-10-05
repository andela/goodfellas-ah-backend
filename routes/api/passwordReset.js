import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
import {} from 'dotenv/config';
import { User } from '../../models';
import sendEmail from '../../lib/mailer';
import passwordResetMiddleware from '../../middleware/passwordResetMiddleware';
import PasswordResetController from '../../controllers/passwordResetController';

const { env } = process;
const passwordResetRouter = express.Router();
const middleware = new passwordResetMiddleware(User, Op);
const passwordReset = new PasswordResetController(User, jwt, env, nodemailer, Op, sendEmail);

// forgot password
passwordResetRouter
.post('/forgotPassword', middleware.requiredEmail, passwordReset.forgotPassword);

// reset password
passwordResetRouter
.post('/resetPassword', middleware.validateToken, passwordReset.resetPassword);

export default passwordResetRouter;
