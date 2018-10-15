import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { it } from 'mocha';

import { app } from '../server';
import { resetDB } from './resetTestDB';
import db from '../models';

chai.use(chaiHttp);

const { User } = db;
const verificationToken = 'thisisavalidverificationTokenyougetme';
describe('Email Verification', () => {
  before((done) => {
    User.create({
      firstname: 'Funmbi',
      lastname: 'Adeniyi',
      email: 'phunmbi@gmail.com',
      password: 'passworded',
      verification_token: 'thisisavalidverificationTokenyougetme'
    })
      .then((newUser) => {
        console.log('User Created', newUser.dataValues);
      });
    done();
  });
  after((done) => {
    resetDB();
    done();
  });

  describe('User\'s email verification', () => {
    it('Should verify account successfully', (done) => {
      chai
        .request(app)
        .get(`/api/auth/verification/${verificationToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('Account successfully verified');
          done();
        });
    });

    it('Should not verify the same account twice.', (done) => {
      chai
        .request(app)
        .get(`/api/auth/verification/${verificationToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('Your account has already been verified.');
          done();
        });
    });
  });
});
