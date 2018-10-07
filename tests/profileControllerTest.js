import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';

chai.use(chaiHttp);
let id;

describe('Profile controller', () => {
  beforeEach((done) => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send({
        firstname: 'Anthony',
        lastname: 'Ugwu',
        email: 'ty@gmail.com',
        password: 'myPassword'
      })
      .end((err, res) => {
        const { userId } = res.body;
        id = userId;
        done();
      });
  });

  after((done) => {
    resetDB();

    done();
  });

  describe('GET a user profile', () => {
    it('GET /api/profile/user should return a users profile', (done) => {
      chai
        .request(app)
        .get(`/api/profile/user/${id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
  describe('GET user error', () => {
    it('GET /api/profile/user should return an error if user does not exist', (done) => {
      chai
        .request(app)
        .get('/api/profile/user/0')
        .end((err, res) => {
          expect(res.status).to.equal(409);
          done();
        });
    });
  });
});
