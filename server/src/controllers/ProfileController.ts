import { Request, Response, NextFunction } from 'express';
const mongoose = require('mongoose');

const User = mongoose.model('User');
import { TUser } from '../types/index';
import transformImage from '../helpers/transformImage';

const getImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

};

const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const image = req.file;

    transformImage(image, 'profile', 'small');

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