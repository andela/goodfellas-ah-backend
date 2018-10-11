import express from 'express';
import auth from './auth';
import profile from './profile';
import articles from './articles';

const router = express.Router();

router.use('/', auth);
router.use('/', profile);
router.use('/', articles);
// router.use('/', require('./passwordReset'));

export default router;
