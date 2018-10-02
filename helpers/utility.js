const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
	encryptPassword(password) {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		return hash;
	},
	createToken(user) {
		return jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
	},
}