import { Router } from 'express';
import { toggleUserRole, uploadDocuments } from '../controllers/user.controller.js';
import { checkRoles } from '../middleware/auth.js';
import { requestPasswordReset, resetPassword } from '../controllers/user.controller.js';
import { upload } from '../utils.js'

const router = Router();

router.put('/premium/:uid', checkRoles('admin'), toggleUserRole);
router.post('/reset-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.post('/:uid/documents', upload.array('documents', 10), uploadDocuments);

export default router;