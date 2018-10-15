import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';
import { userDetail } from './signUpDetails';

chai.use(chaiHttp);

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

    it('returns the right reponse when a request body field is empty', (done) => {
      const article = {
        title: 'Enough is Enough!',
        description: 'This is a call for Revolt',
        body: ''
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(article)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('A field does not contain any input');
          done();
        });
    });
    it('returns the right reponse when a body field contains only whitespaces', (done) => {
      const article = {
        title: 'Enough is Enough!',
        description: 'This is a call for Revolt',
        body: '     '
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(article)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('A field does not contain any input');
          done();
        });
    });
    it('returns the right reponse when a request body field contains only digits', (done) => {
      const article = {
        title: 'Enough is Enough!',
        description: '7665645544344433443',
        body: 'My people the time has come to revolt against this new government'
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(article)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Input cannot be numbers only!');
          done();
        });
    });
    it('returns the right reponse when a request body field is undefined', (done) => {
      const article = {
        description: 'This is a call for Revolt',
        body: 'My people the time has come to revolt against this new government'
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(article)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Invalid Input');
          done();
        });
    });
    describe('PUT an article', () => {
      it('Returns the right response when a paricular article is updated', (done) => {
        const article = {
          title: 'Enough is Enough!',
          description: 'This is a call for Revolt',
          body: 'My people the time has come to revolt against this new government'
        };
        chai
          .request(app)
          .put(`/api/articles/${slug}`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(article)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Article successfully modified');
            done();
          });
      });
      it('Returns the right response when a paricular article to be updated is not found', (done) => {
        const article = {
          title: 'Enough is Enough!',
          description: 'This is a call for Revolt',
          body: 'My people the time has come to revolt against this new government'
        };
        chai
          .request(app)
          .put('/api/articles/3')
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(article)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('Article not found!');
            done();
          });
      });
      it('Returnsh the right response when a request body field is empty', (done) => {
        const article = {
          title: 'Enough is Enough!',
          description: 'This is a call for Revolt',
          body: ''
        };
        chai
          .request(app)
          .put(`/api/articles/${slug}`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(article)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('A field does not contain any input');
            done();
          });
      });
      it('Returns the right response when a request body field contains only whitespaces', (done) => {
        const article = {
          title: 'Enough is Enough!',
          description: 'This is a call for Revolt',
          body: '       '
        };
        chai
          .request(app)
          .put(`/api/articles/${slug}`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(article)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('A field does not contain any input');
            done();
          });
      });
      it('Returns the right response when a request body field contains only didgits', (done) => {
        const article = {
          title: '6777747747474',
          description: 'This is a call for Revolt',
          body: 'My people the time has come to revolt against this new government'
        };
        chai
          .request(app)
          .put(`/api/articles/${slug}`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(article)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('Input cannot be numbers only!');
            done();
          });
      });
    });
    describe('GET an article', () => {
      it('Returns the right response when a paricular article gotten/fetched', (done) => {
        chai
          .request(app)
          .get(`/api/articles/${slug}`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Article gotten successfully!');
            done();
          });
      });
      it('Returns the right response when a paricular article to get is not found', (done) => {
        chai
          .request(app)
          .get('/api/articles/3')
          .set({ authorization: testToken, Accept: 'application/json' })
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('Article Not found!');
            done();
          });
      });
    });
    describe('React to an article', () => {
      it('Returns a success message when an article is liked for the first time', (done) => {
        const reaction = { reaction: 1 };
        chai
          .request(app)
          .post(`/api/articles/${slug}/react`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(reaction)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal('Successfully added reaction');
            done();
          });
      });

      it('Returns an error message when an unauthorized user attempts to like an article', (done) => {
        const reaction = { reaction: 1 };
        chai
          .request(app)
          .post(`/api/articles/${slug}/react`)
          .send(reaction)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.message).to.equal('Unauthorized request, please login');
            done();
          });
      });

      it('Returns an error message when the reaction field is not filled', (done) => {
        const reaction = { reaction: '' };
        chai
          .request(app)
          .post(`/api/articles/${slug}/react`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(reaction)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
      });

      it('Returns an error message when the reaction field is filled with an incorrect value', (done) => {
        const reaction = { reaction: 'incorrect' };
        chai
          .request(app)
          .post(`/api/articles/${slug}/react`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(reaction)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
      });

      it('Should return an error message when the user tries to react to an article with more than the required fields', (done) => {
        const reaction = {
          reaction: 'incorrect',
          extrafeild: 'extra value'
        };
        chai
          .request(app)
          .post(`/api/articles/${slug}/react`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(reaction)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
    describe('GET all articles', () => {
      it('Returns the right response when all the articles are gotten/fetched', (done) => {
        chai
          .request(app)
          .get('/api/articles')
          .set({ authorization: testToken, Accept: 'application/json' })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Articles gotten successfully!');
            done();
          });
      });
    });
    describe('DELETE an article', () => {
      it('Returns the right response when a particular article is deleted', (done) => {
        chai
          .request(app)
          .delete(`/api/articles/${slug}`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('article successfully deleted');
            done();
          });
      });
      it('Returns the right response when a particular article to be deleted is not found', (done) => {
        chai
          .request(app)
          .delete('/api/articles/3')
          .set({ authorization: testToken, Accept: 'application/json' })
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('Article not found!');
            done();
          });
      });
    });
  });
});
