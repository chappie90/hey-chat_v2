import { Router } from 'express';

import ContactsCtrl from '../controllers/ContactsController';

const router = Router();

router.get('/api/contacts/search', ContactsCtrl.searchContacts);
router.get('/api/contacts', ContactsCtrl.getContacts);

export default router;