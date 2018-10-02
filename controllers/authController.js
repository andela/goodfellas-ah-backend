const bcrypt = require('bcrypt-nodejs');
const db = require('../models');
const utility = require('../helpers/utility');
const { User } = db;

module.exports = {
	signup(req, res, next) {
		const { firstname, lastname, email, password } = req.body;
		const encryptedPassword = utility.encryptPassword(password);

		User.findOne({ where: { email: email } }).then(user => {
			if (user) {
				return res.status(400).send({ message: 'Email is in use' });
			}

			User.create({
				firstname: firstname,
				lastname: lastname,
				email: email,
				password: encryptedPassword,
				role: 'User'
			})
			.then(newUser => res.status(201).send({ token: utility.createToken(newUser)  }))
			.catch(error => res.status(400).send(error));
		})
	}
}