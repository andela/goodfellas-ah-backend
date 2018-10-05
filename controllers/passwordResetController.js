export default class PasswordResetController {
    constructor(User, jwt, env, nodemailer, Op) {
      this.User = User;
      this.jwt = jwt;
      this.env = env;
      this.mailer = nodemailer;
      this.Op = Op;
      this.forgotPassword = this.forgotPassword.bind(this);
      this.sendEmail = this.sendEmail.bind(this);
      this.validateToken = this.validateToken.bind(this);
      this.resetPassword = this.resetPassword.bind(this);
    }

    sendEmail(res, mailOptions, email, password, message){

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
                    return res.status(200).send({ message });
                } 
            });
        });
    }


    requiredEmail(req, res, next){
        if (!req.body.email || req.body.email.trim() === 0) {
            return res.status(400).send({ 
                message: 'Please enter your email' });
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
                            const message = { message: 'An email has been sent to your account', token}
                            return this.sendEmail(res, mailOptions, this.env.EMAIL, this.env.EMAIL_PASSWORD, message);
                        });
                    });
                } 
            });
        }
        
        
        validateToken(req, res, next){
            const token = req.query.token;
            
            if(!token){
              return res.status(404).send({
                error: 'Token not found!'
              });
            }
        
            return this.User.findOne({
              where: { password_reset_token: token,
              password_reset_time: { [this.Op.gt]: Date.now() }
             },
            }).then((user) => {
              if (!user) {
                return res.status(404).send({
                  message: 'User can not be found'
                });
              }
              req.user = user;
              next();
            }); 
        }
        
        resetPassword(req, res){
            const mailOptions = {
                from: '"Authors\' Haven" <goodfellascohort40@gmail.com>', 
                to: req.body.email, 
                subject: 'Message from Authors\' Haven2', 
                html: '<p>Your password has been reset successfully</p>'
            };
            return this.User.findOne({ where: { id: req.user.id } })
              .then((userToUpdate) => {
                userToUpdate.update({
                  password: req.body.password,
                  password_reset_token: null,
                  password_reset_time: null,
                })
                  .then((success) => {
                    const message = 'Password reset successful';
                    return this.sendEmail(res, mailOptions, this.env.EMAIL, this.env.EMAIL_PASSWORD, message);
                });
            });
          }
    
    
    }


