import { Profiles, User } from '../models';
import utility from '../lib/utility';
import helper from '../lib/helper';


module.exports = {
  createProfile(newUser) {
    Profiles.create({
      userId: newUser.id
    });
  },
  async updateProfile(req, res) {
    try {
      let image = null;
      if (req.files && req.files.image) {
        image = await utility.imageUpload(req.files);
      }
      const values = utility.trimValues(req.body);
      const { username, bio } = values;
      const { userId } = req;
      const id = req.params.userId;
      const existingProfile = await helper.findRecord(Profiles, {
        userId: id
      });
      if (!existingProfile) {
        return res.status(409).json({
          error: true,
          message: 'Profile does not exist'
        });
      }
      if (existingProfile.userId !== userId) {
        return res.status(400).send({
          error: true,
          message: 'You are do not have the authorization to update this profile'
        });
      }
      const userProfile = await existingProfile.updateAttributes({
        username: username || existingProfile.username,
        bio: bio || existingProfile.bio,
        image: image || existingProfile.image
      });
      res.status(200).send({
        error: false,
        message: 'Profile updated Successfully',
        profile: userProfile
      });
    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  },
  async getProfile(req, res) {
    try {
      const { userId } = req.params;
      const userAttributes = ['firstname', 'lastname', 'email', 'role'];
      const privateAttributes = ['notificationSettings'];
      const attributes = Number(req.userId) === Number(userId)
        ? userAttributes.concat(privateAttributes) : userAttributes;
      const existingProfile = await helper.findRecord(Profiles, {
        userId
      });
      if (!existingProfile) {
        return res.status(409).json({
          error: true,
          message: 'User does not exist'
        });
      }
      Profiles.findOne({
        where: { userId },
        include: [{
          model: User,
          as: 'user',
          attributes,
        }]
      }).then(profile => res.status(200).json({
        error: false,
        data: profile,
        message: 'Profile retrieved successfully'
      }));
    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  async getProfiles(req, res) {
    try {
      const profileList = await Profiles.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['firstname', 'lastname', 'email', 'role']
          }
        ]
      });
      res.send({
        message: 'Successfully retrieved a list of author profiles',
        data: profileList
      });
    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  }
};
