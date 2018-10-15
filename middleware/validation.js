import { Op } from 'sequelize';
import { User, Articles } from '../models';

const operator = Op;

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

  if (route === 'signin' && fieldLength > 2) {
    return true;
  }
  if (route === 'signup' && fieldLength > 4) {
    return true;
  }

  return false;
};

const alphaNumeric = (inputTxt) => {
  const letterNumber = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
  if (inputTxt.match(letterNumber)) {
    return true;
  }
  return false;
};

exports.checkNullInput = (req, res, next) => {
  let isUndefined = false;
  let isNull = false;
  let isString = true;
  const {
    title,
    description,
    body
  } = req.body;
  [title, description, body].forEach((field) => {
    if (field === undefined) {
      isUndefined = true;
    }
    if (!isUndefined && !alphaNumeric(field)) {
      if (Number.isInteger(parseFloat(field))) {
        isString = false;
      }
    }
    if (!isUndefined) {
      if (field.trim().length < 1) {
        isNull = true;
      }
    }
  });
  if (isUndefined) {
    return res.status(400).send({ error: 'Invalid Input' });
  }
  if (isNull) {
    return res.status(400).send({ error: 'A field does not contain any input' });
  }
  if (!isString) {
    return res.status(400).send({ error: 'Input cannot be numbers only!' });
  }
  return next();
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
exports.validateResetPassword = (req, res, next) => {
  const emptyFields = checkEmptyFields(req.body);

  if (emptyFields.status) {
    return res.status(400).send({ message: emptyFields.message });
  }
  if (req.body.password.length < 5) {
    return res.status(400).send({ message: 'Passwords must be greater than four characters' });
  }
  if (req.body.password.length !== req.body.confirm_password.length) {
    return res.status(400).send({ message: 'Passwords do not match' });
  }

  next();
};


// middleware for validating forgot password
exports.validateForgotPassword = (req, res, next) => {
  const isEmailValid = checkValidEmail(req.body.email);
  const emptyFields = checkEmptyFields(req.body);

  if (emptyFields.status) {
    return res.status(400).send({ message: emptyFields.message });
  }

  if (!isEmailValid) {
    return res.status(400).send({ message: 'You\'ve entered an invalid email' });
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

const undefinedFields = (data) => {
  const { username, bio } = data;
  if (username === undefined || bio === undefined) {
    return true;
  }
};

// checking for any unwanted field
const extraFields = (data) => {
  const fieldLength = Object.keys(data).length;
  if (fieldLength !== 2) {
    return true;
  }
};
const imageField = (data) => {
  if (typeof data.files.profileImage === 'undefined') {
    return true;
  }
};
const filesFieldLength = (data) => {
  if (Object.keys(data.files).length > 1) {
    return true;
  }
};

exports.profileValidation = (req, res, next) => {
  const undefinedFieldError = undefinedFields(req.body);
  if (undefinedFieldError) {
    return res.status(400).send({ message: 'All fields are required' });
  }
  const emptyFields = checkEmptyFields(req.body);
  const extraFieldsError = extraFields(req.body);
  if (emptyFields.status) {
    return res.status(400).send({ message: emptyFields.message });
  }
  if (extraFieldsError) {
    return res.status(400).send({ message: 'Extra field(s) not required' });
  }
  const imageFieldError = imageField(req);
  if (imageFieldError) {
    return res.status(400).send({ message: 'Profile Image is required' });
  }
  const filesFieldLengthError = filesFieldLength(req);
  if (filesFieldLengthError) {
    return res.status(400).send({ message: 'Extra field(s) not required' });
  }
  next();
};


// checks if an article exist
exports.checkIfArticleExist = (req, res, next) => {
  const articleId = parseInt(req.params.articleId, 10);

  if (isNaN(articleId)) {
    return res.status(400).send({
      errors: `You've entered an invalid article id: ${req.params.articleId}`
    });
  }
  
  return Articles.findById(articleId).then((article) => {
    if (!article) {
      return res.status(404).send({
        message: 'Article can not be found'
      });
    }

    req.article = article;
    next();
  });
};