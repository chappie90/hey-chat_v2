import express, { Router } from 'express';
import mongoose from 'mongoose';

const AuthCtrl = require('../controllers/AuthController');

const router = Router();

router.post('/api/signup', AuthCtrl.signup);
router.post('/api/signin', AuthCtrl.signin);

module.exports = router;