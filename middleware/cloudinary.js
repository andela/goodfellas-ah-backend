const cloudinary = require('cloudinary');

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_APIKEY,
  api_secret: process.env.CLOUD_APISECRET
});

// image upload middleware using cloudinary
const imageUpload = (req, res, next) => {
  if (req.files.profileImage.type !== ('image/jpeg' || 'image/png')) {
    return res.status(400).json({
      error: true,
      message: 'image format should be jpeg or png'
    });
  }
  const maxSize = 1024 * 1024 * 10;
  if (req.files.profileImage.size > maxSize) {
    return res.status(400).json({
      error: true,
      message: 'Maximum image size is 10mb'
    });
  }
  cloudinary.v2.uploader
    .upload(req.files.profileImage.path, {
      width: 150,
      height: 150,
      crop: 'thumb',
      gravity: 'face',
      radius: 'max'
    })
    .then((image) => {
      req.files.length = 0;
      const profileImageUrl = image.secure_url;

      req.imageUrl = {
        profileImageUrl
      };
      return next();
    })
    .catch(() => {
      res.status(400).json({
        error: true,
        message: 'image upload failed'
      });
    });
};

module.exports = { imageUpload };
