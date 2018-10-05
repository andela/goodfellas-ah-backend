export default class PasswordResetMiddleware {
  constructor(User, Op) {
    this.User = User;
    this.Op = Op;
    this.validateToken = this.validateToken.bind(this);
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

validateToken (req, res, next){
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

  }