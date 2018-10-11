import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';
import { userDetail } from './signUpDetails';

chai.use(chaiHttp);
let testToken;

describe('Comment controller', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send(userDetail)
      .end((err, res) => {
        const { token } = res.body;
        testToken = token;
        done();
      });
  });

  after((done) => {
    resetDB();

    done();
  });

  describe('POST comment ', () => {
    it('POST /api/articles/:slug/comments should return a comment', (done) => {
      chai
        .request(app)
        .get('api/articles:slug/comments')
        .set({ authorization: testToken, Accept: 'application/json' })
        // .send({ body: 'This is my first comment' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});
