const cloudinary = require('cloudinary');

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_APIKEY,
  api_secret: process.env.CLOUD_APISECRET
});

const imageUpload = (req, res, next) => {
  cloudinary.uploader
    .upload(req.files.profileImage.path)
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
