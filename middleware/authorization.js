import models from '../models';
import helper from '../lib/helper';

const { User } = models;
/**
 * @function
 * @description middleware for role-based permissions
 * @param {array} allowed - Array of permitted roles
 * @param {object} req Request payload sent to the router
 * @param {object} res - Response payload sent back from the controller
 * @returns {object} - message returned if validation fails
 */
export default function permit(...allowed) {
  const isAllowed = role => allowed.indexOf(role) > -1;

  // return a middleware
  return async (req, res, next) => {
    const existingUser = await helper.findRecord(User, {
      id: req.userId
    });
    if (existingUser && isAllowed(existingUser.role)) {
      next(); // role is allowed, continue to the next middleware
    } else {
      res.status(403).json({ success: false, message: 'Access Denied!, You are not authorized to do this' });
    }
  };
}
