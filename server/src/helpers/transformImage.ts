import Jimp from 'jimp';

const transformImage = (
  imageFile: Express.Multer.File, 
  destinationFolder: string,
  outputSize: string
): void => {
  const uploadsFolder = `${global.appRoot}/public/uploads`;
  const originalImageName = imageFile.filename;

  let outputDimensions: number[];
  if (outputSize === 'small') {
    outputDimensions = [120, 120];
  } else if (outputSize === 'medium') {
    outputDimensions = [200, 200];
  }
  
  let splitNameParts = imageFile.filename.split('.');
  const fileExt = splitNameParts[splitNameParts.length - 1];
  splitNameParts.pop();
  const joinNameParts = splitNameParts.join('');
  const resizedImageName = `${joinNameParts}_small.${fileExt}`;

  Jimp.read(`${uploadsFolder}/${destinationFolder}/original/${originalImageName}`)
    .then(file => {
      return file
        .cover(outputDimensions[0], outputDimensions[1])
        .quality(60)
        .write(`${uploadsFolder}/${destinationFolder}/${outputSize}/${resizedImageName}`)
    })
    .catch(err => console.log(err));
};

export default transformImage;