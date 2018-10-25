import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { userDetail } from './testDetails';

const { app } = require('../server');
const { resetDB } = require('./resetTestDB');

chai.use(chaiHttp);

let testToken;
let slug;

describe('Star rating', () => {
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
    it('Returns the right response when an article is created', (done) => {
      const article = {
        title: 'Enough is Enough!',
        description: 'This is a call for Revolt',
        body: 'My people the time has come to revolt against this new government',
        image: 'null'
      };
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


    it('Should fail when user is not authenticated', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/rating?ratingNumber=5`)
        .set({ authorization: 'testToken', Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('jwt malformed');
          done();
        });
    });

    it('Should fail when article can not be found', (done) => {
      chai
        .request(app)
        .post('/api/articles/4/rating?ratingNumber=5')
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Article can not be found');
          done();
        });
    });

    it('Should fail when rating is an invalid input', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/rating?ratingNumber=tfdtyedv`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.equal('Your rating must be a number: tfdtyedv');
          done();
        });
    });

    it('Should fail when rating is an invalid input', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/rating?ratingNumber=tfdtyedv`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.equal('Your rating must be a number: tfdtyedv');
          done();
        });
    });

    it('Should fail when rating is above 5', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/rating?ratingNumber=7`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.equal('You can\'t rate an article above 5 star');
          done();
        });
    });

    it('Should fail when rating number is not entered', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/rating`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.equal('Please enter a rating number from 1 to 5');
          done();
        });
    });

    it('Should rate an article successfully', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/rating?ratingNumber=4`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('You\'ve rated this article 4 star');
          done();
        });
    });

    it('Should update an article rating successfully', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/rating?ratingNumber=3`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('You\'ve rated this article 3 star');
          done();
        });
    });
  });
});
