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
      email: 'victorukafor@gmail.com',
      password: 'password'
    })
    .end((err, res) => {
      chai
      .request(app)
      .post('/api/forgotPassword')
      .send({
          email: 'victorukafor@gmail.com',
        })
        .end((err, res) => {
          const { token } = res.body.message;
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
        expect(res.body.message).to.equal('Please enter your email');
        done();
      });
    });

    // sends email to registered user who forgot their password
    it('Should send email to registered for password reset', (done) => {
      chai
      .request(app)
      .post('/api/forgotPassword')
      .send({
        email: 'victorukafor@gmail.com',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message.message).to.equal('An email has been sent to your account');
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
        expect(res.body.message).to.equal('User can not be found');
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
        password: 'password'
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('User can not be found');
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
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
  
});
