/**
  *  class PasswordResetMiddleware
  *
  */
export default class PasswordResetMiddleware {
  /**
    *  constructor
    *  Takes 2 parameters
    *  @param  {object} User the first parameter
    *  @param  {object} Op the fifth parameter
    *
    */
  constructor(User, Op) {
    this.User = User;
    this.Op = Op;
    this.validateToken = this.validateToken.bind(this);
  }

  /** A middle method for checking if email is entered
      *  Takes 3 parameters
      *  @param {object} req the first parameter
      *  @param  {object} res the second parameter
      *  @param  {object} next the third parameter
      *  @returns {object} return an object
      *
      */
  requiredEmail(req, res, next) {
    if (!req.body.email || req.body.email.trim() === 0) {
      return res.status(400).send({ message: 'Please enter your email' });
    }
    req.email = req.body.email.trim();
    next();
  }

  /** A middle method for checking if password reset token is valid
      *  Takes 3 parameters
      *  @param {object} req the first parameter
      *  @param  {object} res the second parameter
      *  @param  {object} next the third parameter
      *  @returns {object} return an object
      *
      */
  validateToken(req, res, next) {
    const { token } = req.query;

    if (!token) {
      return res.status(404).send({
        error: 'Token not found!'
      });
    }

    return this.User.findOne({
      where: {
        password_reset_token: token,
        password_reset_time: { [this.Op.gt]: Date.now() }
      },
    }).then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User can not be found'
        });
      }
      req.user = user;
      next();
    });
  }
}
