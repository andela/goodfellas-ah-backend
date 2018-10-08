// checking for undefined fields
const undefinedFields = (req, res, next) => {
  const { username, bio } = req.body;

  if (username === undefined || bio === undefined) {
    return res.status(400).json({
      status: 'fail',
      message: 'All fields are required'
    });
  }
  if (typeof req.files.profileImage === 'undefined') {
    return res.status(400).json({
      status: 'fail',
      message: 'profileImage field is required'
    });
  }
  return next();
};

// checking for any empty field
const emptyField = (req, res, next) => {
  const { username, bio } = req.body;

  if (!username.trim() || !bio.trim()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Fields cannot be empty'
    });
  }
  return next();
};

// checking for any unwanted field
const extraFields = (req, res, next) => {
  const fieldLength = Object.keys(req.body).length + Object.keys(req.files).length;
  if (fieldLength === 3) {
    return next();
  }
  return res.status(400).json({
    status: 'fail',
    message: 'Extra field(s) not required'
  });
};

module.exports = {
  undefinedFields,
  emptyField,
  extraFields
};
