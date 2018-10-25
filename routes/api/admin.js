import authenticate from '../../middleware/authentication';
import adminController from '../../controllers/adminController';
import permit from '../../middleware/authorization';

const router = require('express').Router();

router.put('/admin/:userId', authenticate, permit('Admin'), adminController.createAdmin);
router.put('/admin/revoke/:userId', authenticate, permit('Admin'), adminController.revokeAdmin);
router.get('/admin/reportedArticles', authenticate, permit('Admin'), adminController.getAllReports);

export default router;
