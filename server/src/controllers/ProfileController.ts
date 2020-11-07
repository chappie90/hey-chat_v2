import { Request, Response, NextFunction } from 'express';
const mongoose = require('mongoose');

const User = mongoose.model('User');
import transformImage from '../helpers/transformImage';

const getImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.query;

    const user = await User.findOne({ _id: userId });

    res.status(200).send({ profileImage: user.profile.image.medium.path });
  } catch(err) {
    console.log(err);
    next(err);
  }
};

const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const image = req.file;
    const userId = req.body.userId;

    const profileImgFolder = 'public/uploads/profile';

    const imageNameOriginal = image.filename;
    const imageNameSmall = transformImage(image, 'profile', 'small');
    const imageNameMedium = transformImage(image, 'profile', 'medium');

    await User.updateOne(
      { _id: userId },
      { profile: {
        image: {
          original: {
            name: imageNameOriginal,
            path: `${profileImgFolder}/original/${imageNameOriginal}`
          },
          small: {
            name: imageNameSmall,
            path: `${profileImgFolder}/small/${imageNameSmall}`
          },
          medium: {
            name: imageNameMedium,
            path: `${profileImgFolder}/medium/${imageNameMedium}`
          }
        }
      } }
    );

    res.status(200).send({ profileImage: `${profileImgFolder}/medium/${imageNameMedium}` }); 
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