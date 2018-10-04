export default class PasswordResetController {
    constructor(User, jwt, env, nodemailer) {
      this.User = User;
      this.jwt = jwt;
      this.env = env;
      this.mailer = nodemailer
      this.forgotPassword = this.forgotPassword.bind(this);
      this.sendEmail = this.sendEmail.bind(this);
    }

    sendEmail(res, mailOptions, email, password){

        this.mailer.createTestAccount((err, account) => {
            const transporter = this.mailer.createTransport({
                service: 'Gmail',
                secure: true, 
                auth: { user: email, pass: password }
            });
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.send(error);
                } else {
                    return res.status(200).send({
                        message: 'An email has been sent to your account'
                    });
                } 
            });
        });
    }


    requiredEmail(req, res, next){
        if (!req.body.email || req.body.email.trim() === 0) {
            return res.status(400).send({ message });
          } else {
              req.email = req.body.email.trim();
              next();
          }
        }

    forgotPassword(req, res) {
            this.User.findOne({ where: { email: req.email } 
            }).then((user) => {
                if (!user) {
                    return res.status(404).send({
                        message: 'User can not be found'
                    });
                } else {
                    const token = this.jwt.sign({ id: user.id }, this.env.SECRET, { expiresIn: 60 * 60 });
                    const mailOptions = {
                        from: '"Authors\' Haven" <goodfellascohort40@gmail.com>', 
                        to: req.body.email, 
                        subject: 'Message from Authors\' Haven2', 
                        html: '<p>Click <a href="http://127.0.0.1:3000/api/resetPassword?token='+token+
                        '">here</a> to reset your password</p>'
                    };

                    const expiration = new Date(Date.now() + (60*60*1000));
                    return this.User.findOne({ where: { email: req.body.email } })
                    .then((saveToken) => {
                        saveToken.update({ password_reset_token: token, password_reset_time: expiration })
                        .then(() => {
                            return this.sendEmail(res, mailOptions, this.env.EMAIL, this.env.EMAIL_PASSWORD);
                        });
                    });
                } 
            });
        }
    
    
    }


