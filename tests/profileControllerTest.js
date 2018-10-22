import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';

import { userDetail } from './signUpDetails';

chai.use(chaiHttp);
let id;
let testToken;

describe('Profile controller', () => {
  beforeEach((done) => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send(userDetail)
      .end((err, res) => {
        const { userId, token } = res.body;
        id = userId;
        testToken = token;
        done();
      });
  });

  afterEach((done) => {
    resetDB();

    done();
  });

  describe('GET a user profile', () => {
    it('GET /api/profile/user should return a users profile', (done) => {
      chai
        .request(app)
        .get(`/api/user/profile/${id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('Check user', () => {
    it('GET /api/user/profile should return an error if user does not exist', (done) => {
      chai
        .request(app)
        .get('/api/user/profile/0')
        .end((err, res) => {
          expect(res.status).to.equal(409);
          done();
        });
    });
  });

  describe('update profile', () => {
    it('PUT /api/user/profile should return an error if any field is undefined', (done) => {
      chai
        .request(app)
        .put(`/api/user/profile/${id}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({
          username: 'test'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('All fields are required');
          done();
        });
    });
    it('PUT /api/user/profile should return an error if the profile image field is undefined', (done) => {
      chai
        .request(app)
        .put(`/api/user/profile/${id}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({
          username: 'test',
          bio: '',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Please fill the bio field');
          done();
        });
    });
    it('PUT /api/user/profile should return an error if the there are extra fields', (done) => {
      chai
        .request(app)
        .put(`/api/user/profile/${id}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({
          username: 'testname',
          bio: 'ddd',
          profileImage: 'juha',
          extra2: 'jj'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Extra field(s) not required');
          done();
        });
    });
  });

  describe('get the profiles of all the users', () => {
    it('GET /api/user/profiles should return a list of profiles for all the registered users', (done) => {
      chai
        .request(app)
        .get('/api/user/profiles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Successfully retrieved a list of author profiles');
          done();
        });
    });

    it('GET /api/user/profiles should return an error if the user is not authenticated', (done) => {
      chai
        .request(app)
        .get('/api/user/profiles')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Unauthorized request, please login');
          done();
        });
    });
  });
});
