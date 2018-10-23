import express from 'express';
import auth from './auth';
import user from './user';
import profile from './profile';
import articles from './articles';
import passwordReset from './passwordReset';
import admin from './admin';

const router = express.Router();

router.use('/', auth);
router.use('/', user);
router.use('/', profile);
router.use('/', articles);
router.use('/', passwordReset);
router.use('/', admin);

export default router;
