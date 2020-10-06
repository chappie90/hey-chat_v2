import { Router } from 'express';

import ChatsCtrl from '../controllers/ChatsController';

const router = Router();

router.get('/api/chats', ChatsCtrl.getChats);

export default router;