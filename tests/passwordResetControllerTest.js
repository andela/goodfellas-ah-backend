import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';

chai.use(chaiHttp);

let resetToken;

describe('Password reset controller', () => {
  beforeEach((done) => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send({
        firstname: 'Victor',
        lastname: 'Ukafor',
        email: 'goodfellascohort40@gmail.com',
        password: 'password'
      })
      .end(() => {
        chai
          .request(app)
          .post('/api/forgotPassword')
          .send({
            email: 'goodfellascohort40@gmail.com',
          })
          .end((err, res) => {
            const { token } = res.body;
            resetToken = token;
            done();
          });
      });
  });

  after((done) => {
    resetDB();
    done();
  });

  describe('Sends email for password reset', () => {
    // Returns an error message when enail is not entered
    it('Should return error when email is entered', (done) => {
      chai
        .request(app)
        .post('/api/forgotPassword')
        .send({
          email: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Please fill the email field');
          done();
        });
    });

    // sends email to registered user who forgot their password
    it('Should send email to registered for password reset', (done) => {
      chai
        .request(app)
        .post('/api/forgotPassword')
        .send({
          email: 'goodfellascohort40@gmail.com',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('An email has been sent to your account');
          done();
        });
    });

    // email should be valid
    it('Should fail when email is invalid', (done) => {
      chai
        .request(app)
        .post('/api/forgotPassword')
        .send({
          email: 'goodfellascohort40gmail.com',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Please enter a valid email');
          done();
        });
    });

    // fields are more than reqiured
    it('Should fail when fields are more than required', (done) => {
      chai
        .request(app)
        .post('/api/forgotPassword')
        .send({
          email: 'goodfellascohort40@gmail.com',
          password: 'password'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Too many fields');
          done();
        });
    });

    // returns a 404 error for user not registered
    it('Should return an error message for user not registered', (done) => {
      chai
        .request(app)
        .post('/api/forgotPassword')
        .send({
          email: 'victor.ukafor@andela.com',
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('The account with this email does not exist');
          done();
        });
    });
  });

  describe('Reset password', () => {
    // Should return error when token does not match or has expired
    it('Should return error when token does not match or has expired', (done) => {
      chai
        .request(app)
        .post('/api/resetPassword?token=7ggfy7e7yyeyf767763ehg')
        .send({
          password: 'password',
          confirm_password: 'password'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('An account can not be found');
          done();
        });
    });

    // password must be filled
    it('Should fail when password is not passed', (done) => {
      chai
        .request(app)
        .post(`/api/resetPassword?token=${resetToken}`)
        .send({
          password: '',
          confirm_password: 'password123',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    // password must be greater 4 characters
    it('Should fail when password is not greater 4 characters', (done) => {
      chai
        .request(app)
        .post(`/api/resetPassword?token=${resetToken}`)
        .send({
          password: 'pas',
          confirm_password: 'password123',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });


    // password fields must match
    it('Should fail when password fields do not match', (done) => {
      chai
        .request(app)
        .post(`/api/resetPassword?token=${resetToken}`)
        .send({
          password: 'password',
          confirm_password: 'password123',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });


    // there are so many field
    it('Should fail when fields are more than required', (done) => {
      chai
        .request(app)
        .post(`/api/resetPassword?token=${resetToken}`)
        .send({
          email: 'victor.ukafor@andela.com',
          password: 'password',
          confirm_password: 'password123',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    // sends email to registered user who forgot their password
    it('Should reset password when token is valid', (done) => {
      chai
        .request(app)
        .post(`/api/resetPassword?token=${resetToken}`)
        .send({
          password: 'password',
          confirm_password: 'password',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});
