import authenticate from '../../middleware/authentication';
import adminController from '../../controllers/adminController';
import permit from '../../middleware/authorization';

const router = require('express').Router();

router.put('/admin/:userId', authenticate, adminController.createAdmin);
router.put('/admin/revoke/:userId', authenticate, permit('Admin'), adminController.revokeAdmin);


export default router;
