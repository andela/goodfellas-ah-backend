import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';
import { userDetail, adminDetail } from './signUpDetails';

chai.use(chaiHttp);

const article = {
  title: 'Enough is Enough!',
  description: 'This is a call for Revolt',
  body: 'My people the time has come to revolt against this new government',
  image: 'null'
};

let userToken;
let adminToken;
let slug;

describe('Report Articles', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send(userDetail)
      .end((err, res) => {
        const { token } = res.body;
        userToken = token;
      });
    chai
      .request(app)
      .post('/api/auth/signup')
      .send(adminDetail)
      .end((err, res) => {
        const { token } = res.body;
        adminToken = token;
        done();
      });
  });

  after((done) => {
    resetDB();

    done();
  });

  describe('Report an article', () => {
    after((done) => {
      resetDB();

      done();
    });

    it('Returns the right response when an article is created', (done) => {
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: userToken, Accept: 'application/json' })
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
        .set({ authorization: 'userToken', Accept: 'application/json' })
        .send({ violation: 'plagiarisism' })
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
        .set({ authorization: userToken, Accept: 'application/json' })
        .send({ violation: 'plagiarisism' })
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
        .set({ authorization: userToken, Accept: 'application/json' })
        .send({ violation: 'plagiarisism' })
        .send(article)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('You have reported this article successfully');
          done();
        });
    });

    it('Should report an article successfully when field is not field', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/report`)
        .set({ authorization: userToken, Accept: 'application/json' })
        .send({ violation: 'plagiarisism' })
        .send(article)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('You have reported this article successfully');
          done();
        });
    });


    it('Should return an error when token is invalid', (done) => {
      chai
        .request(app)
        .get('/api/admin/reportedArticles')
        .set({ authorization: 'invalidtoken', Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('jwt malformed');
          done();
        });
    });

    it('Should return an unauthorized error', (done) => {
      chai
        .request(app)
        .get('/api/admin/reportedArticles')
        .set({ authorization: userToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.error).to.equal('You are not authorised to perform this action!');
          done();
        });
    });

    it('Should return info of articles reported', (done) => {
      chai
        .request(app)
        .get('/api/admin/reportedArticles')
        .set({ authorization: adminToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Reported articles');
          done();
        });
    });
  });
});
