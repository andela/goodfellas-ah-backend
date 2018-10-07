const db = require('../models');
const utility = require('../lib/utility');
const profileSearch = require('../lib/profile');

const { Profiles } = db;

module.exports = {
  createProfile(newUser) {
    Profiles.create({
      userId: newUser.id
    });
  },
  updateProfile(req, res) {
    const values = utility.trimValues(req.body);
    const { username, bio } = values;

    const { profileImageUrl } = req.imageUrl;
    const { userID } = req;

    Profiles.update(
      {
        username,
        bio,
        image: profileImageUrl
      },
      { returning: true, where: { userId: userID } }
    )
      .then(userProfile => res.status(200).send(userProfile))
      .catch(error => res.status(400).send(error));
  },
  async getProfile(req, res) {
    const { userId } = req.params;
    const existingUser = await profileSearch.findProfile(userId);
    if (!existingUser) {
      return res.status(409).json({
        error: true,
        message: 'No user with this profile'
      });
    }
    Profiles.findOne({ where: { userId } }).then(profile => res.status(200).json({
      error: false,
      data: profile
    }));
  }
};
