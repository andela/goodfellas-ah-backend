import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import nodemailer from 'nodemailer';
import {} from 'dotenv/config';
import crypto from 'crypto';


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
  castSQLLoggingBoolean(val) {
    if (val === 'true' || val === undefined) return true;
    if (val === 'false') return false;
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
        imageFile.image.path,
      );
      imageFile.length = 0;
      const url = image.secure_url;
      return url;
    } catch (error) {
      return error;
    }
  },


  mockEmail(email, mailMessage) {
    if (email && mailMessage) {
      return 'Email has been sent successfully';
    }
    return false;
  },


  processEmail(email, mailMessage) {
    return new Promise((resolve) => {
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
          if (!error) {
            return resolve({
              status: 'success'
            });
          }
        });
      });
    });
  },

  sendEmail(email, mailMessage) {
    if (process.env.NODE_ENV === 'test') {
      return this.mockEmail(email, mailMessage);
    }
    return this.processEmail(email, mailMessage);
  },

  async strategyCallback(token, tokenSecret, profile, done) {
    // Get access to the user details and send it to the controller
    try {
      const user = {
        firstName: '',
        lastName: '',
        email: profile.emails[0].value,
        password: profile.id,
        account_type: profile.provider
      };
      done(null, user);
    } catch (error) {
      done(error, false, error.message);
    }
  },

  encryptToken() {
    return crypto.randomBytes(32).toString('hex');
  }
};
