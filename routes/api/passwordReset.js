import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
import {} from 'dotenv/config';
import { User } from '../../models';
import PasswordResetController from '../../controllers/passwordResetController';

const env = process.env;
const passwordResetRouter = express.Router();
const passwordReset = new PasswordResetController(User, jwt, env, nodemailer, Op);

// forgot password
passwordResetRouter.post('/forgotPassword', 
passwordReset.requiredEmail, passwordReset.forgotPassword);

// reset password
passwordResetRouter.post('/resetPassword', 
passwordReset.validateToken, passwordReset.resetPassword);

export default passwordResetRouter;
