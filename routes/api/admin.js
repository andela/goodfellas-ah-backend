import authenticate from '../../middleware/authentication';
import adminController from '../../controllers/adminController';

const router = require('express').Router();

router.put('/admin/:userId', authenticate, adminController.createAdmin);
router.put('/admin/revoke/:userId', authenticate, adminController.revokeAdmin);


export default router;
