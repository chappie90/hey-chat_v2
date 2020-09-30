import express, { Router } from 'express';
import mongoose from 'mongoose';

const ContactsCtrl = require('../controllers/ContactsController');

const router = Router();

router.post('/api/contacts/search', ContactsCtrl.searchContacts);

module.exports = router;