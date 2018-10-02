const checkFields = data => Object.keys(data).filter(field => (!data[field] || !/\S/.test(data[field])));

const generateString = (missing, errorString) => {
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
}

module.exports = {
	signupPost(req, res, next) {
	    const { firstname, lastname, email, password } = req.body;
	    const fieldLength = Object.keys(req.body).length;
	    const missing = checkFields({ firstname, lastname, email, password });
	    let errorString = 'Please fill the ';
	    errorString = generateString(missing, errorString);
	    if (missing.length > 0) {
	      return res.status(400).send({ message: errorString });
	    }
	    if (!email.match(/[A-z0-9.]+@[A-z]+\.(com|me)/)) {
	      return res.status(400).send({ message: 'Please enter a valid email' });
	    }
	    if (password.length < 5) {
	      return res.status(400).send({ message: 'Passwords must be greater than four characters' });
	    }
	    if (fieldLength > 4) {
	      return res.status(400).send({ message: 'Too many fields' });
	    }
	    next();
  	},
}
