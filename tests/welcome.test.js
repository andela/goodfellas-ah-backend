import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';

chai.use(chaiHttp);

describe('Social Login Authentication', () => {
  after((done) => {
    resetDB();

    done();
  });

  describe('Welcome Route', () => {
    it('should hit welcome route', (done) => {
      chai
        .request(app)
        .get('/')
        .end((req, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Welcome to the Authors Haven API');
          done();
        });
    });
  });
});
