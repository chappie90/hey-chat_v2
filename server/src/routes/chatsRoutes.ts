import { Router } from 'express';

import ChatsCtrl from '../controllers/ChatsController';

const router = Router();

router.get('/api/chats', ChatsCtrl.getChats);
router.get('/api/messages', ChatsCtrl.getMessages);

export default router;