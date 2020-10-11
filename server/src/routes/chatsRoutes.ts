import { Router } from 'express';

import ChatsCtrl from '../controllers/ChatsController';

const router = Router();

router.get('/api/chats', ChatsCtrl.getChats);
router.get('/api/messages', ChatsCtrl.getMessages);
router.get('/api/messages/more', ChatsCtrl.getMoreMessages);

export default router;