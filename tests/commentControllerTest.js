import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';
import { userDetail, userDetail2 } from './signUpDetails';

chai.use(chaiHttp);
let testToken;
let testToken2;
let slug;
let commentId;
let replyId;

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
  beforeEach((done) => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send(userDetail2)
      .end((err, res) => {
        const { token } = res.body;
        testToken2 = token;
        done();
      });
  });
  beforeEach((done) => {
    const article = {
      title: 'Enough is Enough!',
      description: 'This is a call for  Revolt',
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
  beforeEach((done) => {
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
  beforeEach((done) => {
    chai
      .request(app)
      .post(`/api/articles/comments/reply/${commentId}`)
      .set({ authorization: testToken, Accept: 'application/json' })
      .send({ body: 'This is my first comment reply' })
      .end((err, res) => {
        const { id } = res.body.reply;
        replyId = id;
        done();
      });
  });
  beforeEach((done) => {
    chai
      .request(app)
      .post(`/api/articles/${slug}/comments/react/${commentId}`)
      .set({ authorization: testToken2, Accept: 'application/json' })
      .send({ reaction: 1 })
      .end(() => {
        done();
      });
  });
  beforeEach((done) => {
    chai
      .request(app)
      .post(`/api/articles/${slug}/favorite`)
      .set({ authorization: testToken2, Accept: 'application/json' })
      .send({ body: 'This is my first comment reply' })
      .end(() => {
        done();
      });
  });

  afterEach((done) => {
    resetDB();

    done();
  });

  describe('POST comment ', () => {
    it('POST /api/articles/slug/comments should post a comment', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ body: 'This is my first comment yes' })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('comment posted successfully');
          const { id } = res.body.comment;
          commentId = id;
          done();
        });
    });
    it('POST /api/articles/slug/comments should throw an error if the article does not exist', (done) => {
      chai
        .request(app)
        .post('/api/articles/notin/comments')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ body: 'This is my first comment' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Article does not exist');
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
    it('POST /api/articles/slug/comments should throw an error if body is not provided', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('All fields are required');
          done();
        });
    });
    it('POST /api/articles/slug/comments should throw an error if body is empty', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ body: '' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Please fill the body field');
          done();
        });
    });
    it('POST /api/articles/slug/comments should throw an error if an extra field is provided', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({
          body: 'hhhh',
          extrafield: 'why'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Extra field(s) not required');
          done();
        });
    });
    it('GET /api/articles/slug/comments should throw an error if the article does not exist', (done) => {
      chai
        .request(app)
        .get('/api/articles/notin/comments')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Article does not exist');
          done();
        });
    });
    it('DELETE /api/articles/slug/comments should throw an error if the article does not exist', (done) => {
      chai
        .request(app)
        .delete('/api/articles/notin/comments/1')
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Article does not exist');
          done();
        });
    });
    it('DELETE /api/articles/slug/comments should throw an error if the comment does not exist', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/${slug}/comments/${commentId + 1}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Comment does not exist');
          done();
        });
    });
    it('DELETE /api/articles/slug/comments throws an error when user is not authorized to delete comment', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/${slug}/comments/${commentId}`)
        .set({ authorization: testToken2, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('You don\'t have the authorization to delete this comment');
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
        .send({ body: 'This is my first comment updateh' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('comment updated successfully');
          done();
        });
    });
    it('PUT /api/articles/slug/comments should throw an error if article does not exist', (done) => {
      chai
        .request(app)
        .put(`/api/articles/notin/comments/${commentId}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ body: 'This is my first comment update' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Article does not exist');
          done();
        });
    });
    it('PUT /api/articles/slug/comments should throw an error if comment does not exist', (done) => {
      chai
        .request(app)
        .put(`/api/articles/${slug}/comments/${commentId + 1}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ body: 'This is my first comment update' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Comment does not exist');
          done();
        });
    });
    it('PUT /api/articles/slug/comments should throw an error if user is not authorized to update the comment', (done) => {
      chai
        .request(app)
        .put(`/api/articles/${slug}/comments/${commentId}`)
        .set({ authorization: testToken2, Accept: 'application/json' })
        .send({ body: 'This is my first comment update' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('You don\'t have the authorization to update this comment');
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
    it('POST /articles/comments/reply/:commentId should throw an error if comment does not exist', (done) => {
      chai
        .request(app)
        .post(`/api/articles/comments/reply/${commentId + 1}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ body: 'This is my first comment reply' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Comment does not exist');
          done();
        });
    });
    it('PUT /articles/comments/reply/:commentId should throw an error if reply does not exist', (done) => {
      chai
        .request(app)
        .put(`/api/articles/comments/reply/${replyId + 1}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ body: 'This is my first comment reply' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Reply does not exist');
          done();
        });
    });
    it('PUT /articles/comments/reply/:commentId should update the reply to a comment', (done) => {
      chai
        .request(app)
        .put(`/api/articles/comments/reply/${replyId}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ body: 'This is my first reply update' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('reply updated successfully');
          done();
        });
    });
    it('PUT /articles/comments/reply/:commentId should throw an error if user is not authorized to update the reply', (done) => {
      chai
        .request(app)
        .put(`/api/articles/comments/reply/${replyId}`)
        .set({ authorization: testToken2, Accept: 'application/json' })
        .send({ body: 'This is my first reply update' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('You don\'t have the authorization to update this reply');
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
    it('GET /articles/comments/reply/:commentId gets an empty array if comments has  no reply', (done) => {
      chai
        .request(app)
        .get(`/api/articles/comments/reply/${commentId + 1}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('This comment has no reply');
          done();
        });
    });
    it('DELETE /articles/comments/reply/:replyId deletes the reply to a comment', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/comments/reply/${replyId}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('reply deleted successfully');
          done();
        });
    });
    it('DELETE /articles/comments/reply/:replyId throws an error if reply does not exist ', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/comments/reply/${replyId + 1}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Reply does not exist');
          done();
        });
    });
    it('DELETE /articles/comments/reply/:replyId throws an error if user is not authorized to delete the reply', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/comments/reply/${replyId}`)
        .set({ authorization: testToken2, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('You don\'t have the authorization to delete this reply');
          done();
        });
    });
    it('POST api/articles/title/comments/react/1 should react to a comment', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments/react/${commentId}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ reaction: 1 })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('reaction posted successfully');
          done();
        });
    });
    it('POST api/articles/title/comments/react/1 should react to a comment', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments/react/${commentId}`)
        .set({ authorization: testToken2, Accept: 'application/json' })
        .send({ reaction: -1 })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('reaction updated successfully');
          done();
        });
    });
    it('POST api/articles/title/comments/react/1 should react to a comment', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments/react/${commentId}`)
        .set({ authorization: testToken2, Accept: 'application/json' })
        .send({ reaction: 1 })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Successfully removed reaction');
          done();
        });
    });
    it('POST api/articles/title/comments/react/1 should throw an error if the reaction field is empty', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments/react/${commentId}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ reaction: '' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Please fill the reaction field');
          done();
        });
    });
    it('POST api/articles/title/comments/react/1 should throw an error if an invalid reaction is provided', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments/react/${commentId}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({ reaction: 12 })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Incorrect reaction value provided');
          done();
        });
    });
    it('POST api/articles/title/comments/react/1 should throw an error if an extrafield is provided', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments/react/${commentId}`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({
          reaction: 1,
          extra: 2
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Too many fields');
          done();
        });
    });
    it('POST api/articles/title/comments/react/1 should throw an error if user is not authenticated', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments/react/${commentId}`)
        .send({
          reaction: 1
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Unauthorized request, please login');
          done();
        });
    });
    it('should favorite an article', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/favorite`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Article favorited successfully');
          done();
        });
    });
    it('should return error if article has already been favorited', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/favorite`)
        .set({ authorization: testToken2, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Article has already been favourited');
          done();
        });
    });
    it('should return error if article does not exist', (done) => {
      chai
        .request(app)
        .post('/api/articles/notitle/favorite')
        .set({ authorization: testToken2, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('Article Not found!');
          done();
        });
    });
    it('should return an error if user tries to unfavorite an article that is not initially favorited', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/${slug}/favorite`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('This article is not currently favorited');
          done();
        });
    });
    it('should unfavorite an article', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/${slug}/favorite`)
        .set({ authorization: testToken2, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Article succesfully removed from list of favorites');
          done();
        });
    });
    it('should throw an error if article is not found', (done) => {
      chai
        .request(app)
        .delete('/api/articles/notityle/favorite')
        .set({ authorization: testToken2, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('Article Not found!');
          done();
        });
    });
    it('should get all the users that favorited an article', (done) => {
      chai
        .request(app)
        .get(`/api/articles/${slug}/favorite`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Successfully retrieved users who favorited this article');
          done();
        });
    });
  });
  describe('Highlight an article and comment', () => {
    it('POST /api/articles/slug/comments/highlight should post a comment', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${slug}/comments`)
        .set({ authorization: testToken, Accept: 'application/json' })
        .send({
          body: 'This is my first comment',
          pageId: 'randomString',
          highlight: 'This is the highlighted text',
          startIndex: 1,
          endIndex: 20
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('comment posted successfully');
          done();
        });
    });
  });
});
