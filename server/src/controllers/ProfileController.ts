import { Request, Response, NextFunction } from 'express';
const mongoose = require('mongoose');

const User = mongoose.model('User');
import convertImage from '../helpers/convertImage';
import resizeImage from '../helpers/resizeImage';

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

    let imageNameOriginal: string;

    const profileImgFolder = 'public/uploads/profile';

    let splitNameParts = image.filename.split('.');
    let fileExt = splitNameParts[splitNameParts.length - 1];
    splitNameParts.pop();
    const joinNameParts = splitNameParts.join('');

    imageNameOriginal = image.filename;

    if (fileExt === 'heic' || fileExt === 'heif') {
      await convertImage(
        `${global.appRoot}/${profileImgFolder}/original/${imageNameOriginal}`,
        `${global.appRoot}/${profileImgFolder}/original/${joinNameParts}.jpg`
      );

      imageNameOriginal = `${joinNameParts}.jpg`;
    }

    const imageNameSmall = await resizeImage(imageNameOriginal, 'profile', 'small');
    const imageNameMedium = await resizeImage(imageNameOriginal, 'profile', 'medium');

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