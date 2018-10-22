import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';
import { userDetail } from './signUpDetails';

chai.use(chaiHttp);

const article = {
  title: 'Enough is Enough!',
  description: 'This is a call for Revolt',
  body: 'My people the time has come to revolt against this new government',
  image: 'null'
};

let testToken;
let slug;

describe('Articles controller', () => {
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

  describe('POST an article', () => {
    after((done) => {
      resetDB();

      done();
    });

    it('Returns the right response when an article is created', (done) => {
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(article)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          const { title } = res.body.article;
          expect(title).to.equal('Enough is Enough!');
          expect(res.body.message).to.equal('You have created an article successfully');
          const articleSlug = res.body.article.slug;
          slug = articleSlug;
          done();
        });
    });

    it('Returns 401 error when user is not authenticated', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/report`)
        .set({ authorization: 'testToken', Accept: 'application/json' })
        .send(article)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('jwt malformed');
          done();
        });
    });

    it('Returns 404 error when article can not be found', (done) => {
      chai
        .request(app)
        .post('/api/articles/slug/report')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(article)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('Article Not found!');
          done();
        });
    });

    it('Should report an article successfully', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/report`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(article)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('You have reported this article successfully');
          done();
        });
    });

    it('Should report an article successfully', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/report`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(article)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('You have reported this article successfully');
          done();
        });
    });
  });
});
