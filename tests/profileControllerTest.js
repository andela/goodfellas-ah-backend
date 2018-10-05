import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';

chai.use(chaiHttp);

describe('Profile controller', () => {
  after((done) => {
    resetDB();

    done();
  });

  describe('Create user profile on signup', () => {
    it('POST to /auth/signup should create a user with a profile successfully', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send({
          firstname: 'Anthony',
          lastname: 'ugwu',
          email: 'anthony3@gmail.com',
          password: 'password'
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.token).to.be.a('string');
          expect(res.body.message).to.be.a('string');
          done();
        });
    });
    it('GET to /profile/user should get a user profile', (done) => {
      chai
        .request(app)
        .get('/api/profile/user/1')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});
