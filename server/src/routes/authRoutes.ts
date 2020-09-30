import { Router } from 'express';

import AuthCtrl from '../controllers/AuthController';

const router = Router();

router.post('/api/signup', AuthCtrl.signup);
router.post('/api/signin', AuthCtrl.signin);

export default router;