import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';

chai.use(chaiHttp);

let testToken;

describe('Articles controller', () => {
  beforeEach((done) => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send({
        firstname: 'Anthony',
        lastname: 'Ugwu',
        email: 'anthonyugwu@gmail.com',
        password: 'myPassword'
      })
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

  describe('GET all the articles', () => {
    // Please remove when working on this feature
    it('(DUMMY TEST) GET to /api/articles should return all the articles', (done) => {
      chai
        .request(app)
        .get('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal(
            'All Articles Retrieved Successfully'
          );
          done();
        });
    });

    it('GET to /api/articles should return an error message if a token is not provided', (done) => {
      chai
        .request(app)
        .get('/api/articles')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal(
            'Unauthorized request, please login'
          );
          done();
        });
    });
  });
});
