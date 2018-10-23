import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';
import { adminDetail, userDetail, userDetail2 } from './testDetails';

chai.use(chaiHttp);

let Token2;
let Token;
let userId;

describe('Admin user', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send(userDetail)
      .end((err, res) => {
        const id = res.body.userId;
        userId = id;
      });
    chai
      .request(app)
      .post('/api/auth/signup')
      .send(userDetail2)
      .end((err, res) => {
        const { token } = res.body;
        Token = token;
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
          Token2 = token;
          expect(res.status).to.equal(201);
          expect(res.body.token).to.be.a('string');
          expect(res.body.message).to.equal('Admin Created!');
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
  describe('Updating user role', () => {
    it('PUT to /admin/:userId should update user role to Admin successfully', (done) => {
      chai
        .request(app)
        .put(`/api/admin/${userId}`)
        .set({ authorization: Token2, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(202);
          expect(res.body.message).to.equal('Admin User created successfully!');
          done();
        });
    });
    it('PUT to /admin/:userId should return an error when role of a user is not Admin', (done) => {
      chai
        .request(app)
        .put(`/api/admin/${userId}`)
        .set({ authorization: Token, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.equal('You are not authorised to perform this action!');
          done();
        });
    });
    it('PUT to /admin/revoke/:userId should revoke Admin role to User successfully', (done) => {
      chai
        .request(app)
        .put(`/api/admin/revoke/${userId}`)
        .set({ authorization: Token2, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(202);
          expect(res.body.message).to.equal('Admin status successfully revoked!');
          done();
        });
    });
    it('PUT to /admin/revoke/:userId should return an error when role of a user is not Admin', (done) => {
      chai
        .request(app)
        .put(`/api/admin/revoke/${userId}`)
        .set({ authorization: Token, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('Access Denied!, You are not authorized to do this');
          done();
        });
    });
  });
});
