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
			.catch(error => res.status(400).send({ error: error.message }));
		})
		.catch(error => res.status(500).send({ error: error.message }));
	},
	signin(req, res, next) {
		const values = utility.trimValues(req.body);
		const { email, password } = values;

		User.findOne({ where: { email: email } }).then((user) => {
			if (!user) {
          		return res.status(400).send({ message: 'The account with this email does not exist' });
        	}
        	
        	bcrypt.compare(password, user.dataValues.password, (err, match) => {
        		if(match) {
        			res.status(200).send({
              			message: 'Successfully signed in',
              			token: utility.createToken(user.dataValues.id),
            		});
        		} else {
            		res.status(400).send({ message: 'Incorrect email or password' });
          		}
        	});
		})
		.catch(error => res.status(500).send({ error: error.message }));
	}
}