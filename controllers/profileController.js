const db = require('../models');

const { Profiles } = db;

module.exports = {
  createProfile(newUser) {
    Profiles.create({
      userId: newUser.id
    });
  },
  updateProfile(req, res) {
    const { username, bio } = req.body;

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
      .then(userProfile => res.status(201).send(userProfile))
      .catch(error => res.status(400).send(error));
  },
  getProfile(req, res) {
    const { userId } = req.params;
    Profiles.findOne({ where: { userId } }).then(profile => res.send(profile));
  }
};
