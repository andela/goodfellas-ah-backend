import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';
import { adminDetail, userDetail } from './signUpDetails';

chai.use(chaiHttp);

let Token;
let userId;

describe('Admin user', () => {
  before((done) => {
    resetDB();
    chai
      .request(app)
      .post('/api/auth/signup')
      .send(userDetail)
      .end((err, res) => {
        const id = res.body.userId;
        userId = id;
        done();
      });
  });


  after((done) => {
    resetDB();

    done();
  });
  describe('Creating an Admin user', () => {
    it('POST to /auth/signup should create an Amin user successfully', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(adminDetail)
        .end((err, res) => {
          const { token } = res.body;
          Token = token;
          expect(res.status).to.equal(200);
          expect(res.body.token).to.be.a('string');
          expect(res.body.message).to.equal('Admin created!');
          done();
        });
    });
    it('Return an error when user already exists', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(adminDetail)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.message).to.equal('Email is in use');
          done();
        });
    });
  });
 /* describe('Updating user role to Admin user', () => {
    it('PUT to /admin/:userId should update user role to Admin successfully', (done) => {
      chai
        .request(app)
        .put(`/api/admin/${userId}`)
        .set({ authorization: Token, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(202);
          expect(res.body.message).to.equal('Admin User created successfully!');
          done();
        });
    });
  }); */
});
