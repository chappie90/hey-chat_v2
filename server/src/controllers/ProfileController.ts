import { Request, Response, NextFunction } from 'express';
const mongoose = require('mongoose');

const User = mongoose.model('User');
import { TUser } from '../types/index';

const getImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

};

const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log(req.file)

    res.status(200).send({ placeholder: '' }); 
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deleteImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

};

export default {
  getImage,
  uploadImage,
  deleteImage
};