const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cloudinary = require('cloudinary');


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_APIKEY,
  api_secret: process.env.CLOUD_APISECRET
});


module.exports = {
  async encryptPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  },
  async comparePasswords(password, userPassword) {
    const match = await bcrypt.compare(password, userPassword);
    return match;
  },
  createToken(user) {
    return jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: 86400 });
  },
  trimValues(values) {
    const newValues = {};
    Object.keys(values).map((key) => {
      newValues[key] = values[key].trim();
      return newValues;
    });
    return newValues;
  },

  async imageUpload(imageFile) {
    try {
      const image = await cloudinary.v2.uploader.upload(
        imageFile.profileImage.path,
        {
          width: 150,
          height: 150,
          crop: 'thumb',
          gravity: 'face',
          radius: 'max'
        }
      );
      imageFile.length = 0;
      const profileImageUrl = image.secure_url;
      return profileImageUrl;
    } catch (error) {
      return error;
    }
  },

  sendEmail(email, mailMessage) {
    return new Promise((resolve, reject) => {
      nodemailer.createTestAccount(() => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD }
        });

        const mailProperties = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Message from Authors\' Haven2',
          html: `<p>${mailMessage}</p>`,
        };

        transporter.sendMail(mailProperties, (error) => {
          console.log(error);
          if (!error) {
            return resolve({
              status: 'success'
            });
          }
          reject();
        });
      });
    });
  },

};
