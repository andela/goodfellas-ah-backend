import db from '../models';
import utility from '../lib/utility';
import helper from '../lib/helper';

const { Profiles, User } = db;

module.exports = {
  createProfile(newUser) {
    Profiles.create({
      userId: newUser.id
    });
  },
  async updateProfile(req, res) {
    try {
      const url = await utility.imageUpload(req.files);
      const values = utility.trimValues(req.body);
      const { username, bio } = values;
      const { userId } = req;

      const userProfile = await Profiles.update(
        {
          username,
          bio,
          image: url
        },
        { returning: true, where: { userId } }
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
    const existingProfile = await helper.findProfile(userId);
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
  },
  async getProfiles(req, res) {
    const profileList = await Profiles.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstname', 'lastname', 'email', 'role']
      }]
    });
    res.send({
      message: 'Successfully retrieved a list of author profiles',
      data: profileList
    });
  }
};
