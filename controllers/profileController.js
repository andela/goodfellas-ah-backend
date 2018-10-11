
const db = require('../models');
const utility = require('../lib/utility');
const profileSearch = require('../lib/profile');
// const validate = require('../middleware/validation');
const imageUploadHelper = require('../lib/utility');

const { Profiles } = db;

module.exports = {
  createProfile(newUser) {
    Profiles.create({
      userId: newUser.id
    });
  },
  async updateProfile(req, res) {
    try {
      const url = await imageUploadHelper.imageUpload(req.files);
      const values = utility.trimValues(req.body);
      const { username, bio } = values;
      const { userID } = req;

      const userProfile = await Profiles.update(
        {
          username,
          bio,
          image: url
        },
        { returning: true, where: { userId: userID } }
      );

      res.status(200).send({
        error: false,
        message: 'Profile updated Successfully',
        profile: userProfile
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getProfile(req, res) {
    const { userId } = req.params;
    const existingProfile = await profileSearch.findProfile(userId);
    if (!existingProfile) {
      return res.status(409).json({
        error: true,
        message: 'User does not exist'
      });
    }
    Profiles.findOne({ where: { userId } }).then(profile => res.status(200).json({
      error: false,
      data: profile
    }));
  }
};
