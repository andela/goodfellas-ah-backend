import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';
import { userDetail } from './signUpDetails';

chai.use(chaiHttp);
let testToken;
let slug;
let commentId;

describe('Comment controller', () => {
  beforeEach((done) => {
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

  afterEach((done) => {
    resetDB();

    done();
  });

  describe('POST comment ', () => {
    it('Creates an article', (done) => {
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
          const articleSlug = res.body.slug;
          slug = articleSlug;
          done();
        });
    });
    it('POST /api/articles/slug/comments should post a  comment', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ body: 'This is my first comment' })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('comment posted successfully');
          const { id } = res.body.comment;
          commentId = id;
          done();
        });
    });
    it('GET /api/articles/slug/comments get all comments and replies', (done) => {
      chai
        .request(app)
        .get(`/api/articles/${slug}/comments`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('comments retrieved successfully');
          done();
        });
    });
    it('DELETE /api/articles/slug/comments deletes a comment', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/${slug}/comments/${commentId}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('comment deleted successfully');
          done();
        });
    });
    it('PUT /api/articles/slug/comments should update a  comment', (done) => {
      chai
        .request(app)
        .put(`/api/articles/${slug}/comments/${commentId}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ body: 'This is my first comment update' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('comment updated successfully');
          done();
        });
    });
    it('POST /articles/comments/reply/:commentId should reply a comment', (done) => {
      chai
        .request(app)
        .post(`/api/articles/comments/reply/${commentId}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ body: 'This is my first comment reply' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('reply posted successfully');
          done();
        });
    });
    it('PUT /articles/comments/reply/:commentId should update the reply to a comment', (done) => {
      chai
        .request(app)
        .put(`/api/articles/comments/reply/${commentId}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ body: 'This is my first reply update' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('reply updated successfully');
          done();
        });
    });

    it('GET /articles/comments/reply/:commentId gets all replies to a comment', (done) => {
      chai
        .request(app)
        .get(`/api/articles/comments/reply/${commentId}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('reply retrieved successfully');
          done();
        });
    });
    it('DELETE /articles/comments/reply/:replyId deletes the reply to a comment', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/comments/reply/${commentId}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('reply deleted successfully');
          done();
        });
    });
  });
});
