import { Router } from 'express';

import PushNotificationsCtrl from '../controllers/PushNotificationsController';

const router = Router();

router.post('/api/push-notifications/token/save', PushNotificationsCtrl.saveDeviceToken);

export default router;