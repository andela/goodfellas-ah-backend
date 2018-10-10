const operator = require('sequelize').Op;
const db = require('../models');

const { User } = db;

const generateErrorMessage = (missing) => {
  let errorString = 'Please fill the ';
  missing.forEach((field) => {
    if (missing[missing.length - 1] === field && missing.length !== 1) {
      errorString += `and ${field} fields`;
    } else if (missing.length === 1) {
      errorString += `${field} field`;
    } else {
      errorString += `${field}, `;
    }
  });
  return errorString;
};

const checkValidEmail = email => email.match(/[A-z0-9.]+@[A-z]+\.(com|me)/);
const checkEmptyFields = (data) => {
  const emptyFields = {};
  const missingFields = Object.keys(data).filter(field => !data[field] || !/\S/.test(data[field]));

  if (missingFields.length > 0) {
    emptyFields.status = true;
    emptyFields.message = generateErrorMessage(missingFields);
  }
  return emptyFields;
};

const checkFieldLength = (route, fields) => {
  const fieldLength = Object.keys(fields).length;

  if (route === 'resetPassword' && fieldLength > 2) {
    return true;
  }
  if (route === 'forgotPassword' && fieldLength > 1) {
    return true;
  }
  if (route === 'signin' && fieldLength > 2) {
    return true;
  }
  if (route === 'signup' && fieldLength > 4) {
    return true;
  }

  return false;
};

// checking for undefined fields
const undefinedFields = (req, res) => {
  const { username, bio } = req.body;

  if (username === undefined || bio === undefined) {
    return res.status(400).json({
      status: 'fail',
      message: 'All fields are required'
    });
  }
};

// checking for any empty field
const emptyField = (req, res) => {
  const { username, bio } = req.body;

  if (!username.trim() || !bio.trim()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Fields cannot be empty'
    });
  }
};

// checking for any unwanted field
const extraFields = (req, res) => {
  const fieldLength = Object.keys(req.body).length;
  if (fieldLength !== 2) {
    return res.status(400).json({
      status: 'fail',
      message: 'Extra field(s) not required'
    });
  }
};

exports.profileValidation = (req, res) => {
  undefinedFields(req, res);
  emptyField(req, res);
  extraFields(req, res);
};

// middleware for validating signup fields
exports.validate = route => (req, res, next) => {
  const userDetails = req.body;
  const tooManyFields = checkFieldLength(route, userDetails);
  const emptyFields = checkEmptyFields(userDetails);
  const validEmail = checkValidEmail(userDetails.email);

  if (emptyFields.status) {
    return res.status(400).send({ message: emptyFields.message });
  }

  if (!validEmail) {
    return res.status(400).send({ message: 'Please enter a valid email' });
  }
  if (userDetails.password.length < 5) {
    return res
      .status(400)
      .send({ message: 'Passwords must be greater than four characters' });
  }
  if (tooManyFields) {
    return res.status(400).send({ message: 'Too many fields' });
  }
  next();
};


// middleware for validating passwords
exports.validateResetPassword = route => (req, res, next) => {
  const userDetails = req.body;
  const tooManyFields = checkFieldLength(route, userDetails);
  const emptyFields = checkEmptyFields(userDetails);

  if (emptyFields.status) {
    return res.status(400).send({ message: emptyFields.message });
  }
  if (userDetails.password.length < 5) {
    return res.status(400).send({ message: 'Passwords must be greater than four characters' });
  }
  if (userDetails.password.length !== userDetails.confirm_password.length) {
    return res.status(400).send({ message: 'Passwords do not match' });
  }
  if (tooManyFields) {
    return res.status(400).send({ message: 'Too many fields' });
  }
  next();
};

// middleware for validating passwords
exports.validateResetPassword = route => (req, res, next) => {
  const userDetails = req.body;
  const tooManyFields = checkFieldLength(route, userDetails);
  const emptyFields = checkEmptyFields(userDetails);

  if (emptyFields.status) {
    return res.status(400).send({ message: emptyFields.message });
  }
  if (userDetails.password.length < 5) {
    return res.status(400).send({ message: 'Passwords must be greater than four characters' });
  }
  if (userDetails.password.length !== userDetails.confirm_password.length) {
    return res.status(400).send({ message: 'Passwords do not match' });
  }
  if (tooManyFields) {
    return res.status(400).send({ message: 'Too many fields' });
  }
  next();
};

// middleware for validating forgot password
exports.validateForgotPassword = route => (req, res, next) => {
  const userDetails = req.body;
  const tooManyFields = checkFieldLength(route, userDetails);
  const validEmail = checkValidEmail(userDetails.email);
  const emptyFields = checkEmptyFields(userDetails);

  if (emptyFields.status) {
    return res.status(400).send({ message: emptyFields.message });
  }

  if (!validEmail) {
    return res.status(400).send({ message: 'Please enter a valid email' });
  }
  if (tooManyFields) {
    return res.status(400).send({ message: 'Too many fields' });
  }

  req.email = req.body.email.trim();
  next();
};

exports.findUserByToken = (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return res.status(404).send({
      message: 'An account can not be found'
    });
  }

  return User.findOne({
    where: {
      password_reset_token: token,
      password_reset_time: { [operator.gt]: Date.now() }
    }
  }).then((user) => {
    if (!user) {
      return res.status(404).send({
        message: 'An account can not be found'
      });
    }

    req.user = user;
    next();
  });
};
