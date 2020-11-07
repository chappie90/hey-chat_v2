import { promisify } from 'util';
import fs from 'fs';
import convert from 'heic-convert';
 
const convertImage = async (oldPath: string, newPath: string): Promise<void> => {
  const inputBuffer = await promisify(fs.readFile)(oldPath);
  const outputBuffer = await convert({
    buffer: inputBuffer, 
    format: 'JPEG', 
    quality: 1 
  });
 
  await promisify(fs.writeFile)(newPath, outputBuffer);
};

export default convertImage;