import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Configure Cloudinary with your Dashboard credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Define the Cloudinary Storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ReacTalk_Profiles', // Folder name inside your Cloudinary dashboard
    allowed_formats: ['jpg', 'png', 'jpeg'],
    // Optional: Transform images to be square and optimized for avatars
    transformation: [{ width: 250, height: 250, crop: 'fill', gravity: 'face' }] 
  },
});

// 3. Export the updated multer instance
export const upload = multer({ storage });