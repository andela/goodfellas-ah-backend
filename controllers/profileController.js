
const db = require('../models');
const utility = require('../lib/utility');
const profileSearch = require('../lib/profile');
const validate = require('../middleware/profileValidation');
const imageUploadHelper = require('../lib/utility');

const { Profiles } = db;

module.exports = {
  createProfile(newUser) {
    Profiles.create({
      userId: newUser.id
    });
  },
  updateProfile(req, res) {
    validate.undefinedFields(req, res);
    validate.emptyField(req, res);
    validate.extraFields(req, res);
    const url = imageUploadHelper.imageUpload(req.files);
    const values = utility.trimValues(req.body);
    const { username, bio } = values;
    const { userID } = req;

    Profiles.update(
      {
        username,
        bio,
        image: url
      },
      { returning: true, where: { userId: userID } }
    )
      .then(userProfile => res.status(200).send(userProfile))
      .catch(error => res.status(400).send(error));
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
