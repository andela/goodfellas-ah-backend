// checking for undefined fields
const undefinedFields = (req, res) => {
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
  const fieldLength = Object.keys(req.body).length + Object.keys(req.files).length;
  if (fieldLength !== 3) {
    return res.status(400).json({
      status: 'fail',
      message: 'Extra field(s) not required'
    });
  }
};

module.exports = {
  undefinedFields,
  emptyField,
  extraFields
};
