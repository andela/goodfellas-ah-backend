import db from '../models';
import helper from '../lib/helper';

const { User, ReportArticle } = db;

/**
 * creates an admin
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const createAdmin = async (req, res) => {
  let existingUser = await helper.findRecord(User, {
    id: req.userId
  });
  if (existingUser.role !== 'Admin') {
    return res.status(403).send({ error: 'You are not authorised to perform this action!' });
  }
  existingUser = await helper.findRecord(User, {
    id: req.params.userId
  });
  existingUser.updateAttributes({
    role: 'Admin',
  })
    .then(user => res.status(202).send({ message: 'Admin User created successfully!', user }))
    .catch(error => res.status(500).send({ error: error.message }));
};

/**
 * revokes admin access
 * @param {object} req The request body of the request.
 * @param {object} res The response body.
 * @returns {object} res.
 */

const revokeAdmin = async (req, res) => {
  let existingUser = await helper.findRecord(User, {
    id: req.userId
  });
  if (existingUser.role !== 'Admin') {
    return res.status(403).send({ error: 'You are not authorised to perform this action!' });
  }
  existingUser = await helper.findRecord(User, {
    id: req.params.userId
  });
  existingUser.updateAttributes({
    role: 'User',
  })
    .then(user => res.status(202).send({ message: 'Admin status successfully revoked!', user }))
    .catch(error => res.status(500).send({ error: error.message }));
};

const getAllReports = async (req, res) => {
  const user = await helper.findRecord(User, { id: req.userId });

  if (user.role !== 'Admin') {
    return res.status(403).send({ error: 'You are not authorised to perform this action!' });
  }
  const allReports = await ReportArticle.findAll({});
  if (!allReports) {
    return res.status(404).send({ message: 'These are info of reported articles' });
  }
  return res.status(200).send({ message: 'These are reported articles', allReports });
};


export default { createAdmin, revokeAdmin, getAllReports };
