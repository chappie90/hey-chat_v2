import Jimp from 'jimp';

const resizeImage = async (
  imageName: string, 
  destinationFolder: string,
  outputSize: string
): Promise<string> => {
  const uploadsFolder = `${global.appRoot}/public/uploads`;;

  let outputDimensions: number[];

  if (outputSize === 'small') {
    outputDimensions = [120, 120];
  } else if (outputSize === 'medium') {
    outputDimensions = [400, 400];
  }
  
  let splitNameParts = imageName.split('.');
  const fileExt = splitNameParts[splitNameParts.length - 1];
  splitNameParts.pop();
  const joinNameParts = splitNameParts.join('');
  const resizedImageName = `${joinNameParts}_${outputSize}.${fileExt}`;

  const originalImagePath = `${uploadsFolder}/${destinationFolder}/original/${imageName}`;

  await Jimp.read(originalImagePath)
    .then(file => {
      return file
        .cover(outputDimensions[0], outputDimensions[1])
        .quality(60)
        .write(`${uploadsFolder}/${destinationFolder}/${outputSize}/${resizedImageName}`)
    })
    .catch(err => console.log(err));

  return resizedImageName;
};

export default resizeImage;