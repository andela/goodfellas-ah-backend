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
