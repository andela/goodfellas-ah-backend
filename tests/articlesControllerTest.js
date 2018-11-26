import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import db from '../models';
import { resetDB } from './resetTestDB';
import {
  userDetail, userDetail2, article, article2,
} from './testDetails';
import generateArticleList from './testHelper';


chai.use(chaiHttp);

const { Articles } = db;
let testToken;
let slug;

describe('Articles controller', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send(userDetail)
      .end((err, res) => {
        const { token, userId } = res.body;
        testToken = token;

        const articleList = generateArticleList(userId);
        Articles.bulkCreate(articleList);
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
          expect(res.body.article.title).to.equal('Enough is Enough!');
          expect(res.body.message).to.equal('You have created an article successfully');
          const articleSlug = res.body.article.slug;
          slug = articleSlug;
          done();
        });
    });

    it('returns the right reponse when a request body field is empty', (done) => {
      const badArticle = {
        title: 'Enough is Enough!',
        description: 'This is a call for Revolt',
        body: ''
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(badArticle)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('A field does not contain any input');
          done();
        });
    });
    it('returns the right reponse when a body field contains only whitespaces', (done) => {
      const badArticle = {
        title: 'Enough is Enough!',
        description: 'This is a call for Revolt',
        body: '     '
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(badArticle)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('A field does not contain any input');
          done();
        });
    });
    it('returns the right reponse when a request body field contains only digits', (done) => {
      const badArticle = {
        title: 'Enough is Enough!',
        description: '7665645544344433443',
        body: 'My people the time has come to revolt against this new government'
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(badArticle)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Input cannot be numbers only!');
          done();
        });
    });
    it('returns the right reponse when a request body field is undefined', (done) => {
      const badArticle = {
        description: 'This is a call for Revolt',
        body: 'My people the time has come to revolt against this new government'
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(badArticle)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Invalid Input');
          done();
        });
    });
    describe('PUT an article', () => {
      it('Returns the right response when a paricular article is updated', (done) => {
        const badArticle = {
          title: 'Enough is Enough!',
          description: 'This is a call for Revolt',
          body: 'My people the time has come to revolt against this new government'
        };
        chai
          .request(app)
          .put(`/api/articles/${slug}`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(badArticle)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Article successfully modified');
            done();
          });
      });
      it('Returns the right response when a paricular article to be updated is not found', (done) => {
        const badArticle = {
          title: 'Enough is Enough!',
          description: 'This is a call for Revolt',
          body: 'My people the time has come to revolt against this new government'
        };
        chai
          .request(app)
          .put('/api/articles/3')
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(badArticle)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('Article not found!');
            done();
          });
      });
      it('Returns the right response when a request body field is empty', (done) => {
        const badArticle = {
          title: 'Enough is Enough!',
          description: 'This is a call for Revolt',
          body: ''
        };
        chai
          .request(app)
          .put(`/api/articles/${slug}`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(badArticle)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('A field does not contain any input');
            done();
          });
      });
      it('Returns the right response when a request body field contains only whitespaces', (done) => {
        const badArticle = {
          title: 'Enough is Enough!',
          description: 'This is a call for Revolt',
          body: '       '
        };
        chai
          .request(app)
          .put(`/api/articles/${slug}`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(badArticle)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('A field does not contain any input');
            done();
          });
      });
      it('Returns the right response when a request body field contains only didgits', (done) => {
        const badArticle = {
          title: '6777747747474',
          description: 'This is a call for Revolt',
          body: 'My people the time has come to revolt against this new government'
        };
        chai
          .request(app)
          .put(`/api/articles/${slug}`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(badArticle)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('Input cannot be numbers only!');
            done();
          });
      });
      it('Returns the right response when a user tries to update another authors article', (done) => {
        let testToken2;
        const updateDetails = {
          title: 'Enough is Enough!',
          description: 'This is a call for Revolt',
          body: 'My people the time has come to revolt against this new government'
        };
        chai
          .request(app)
          .post('/api/auth/signup')
          .send(userDetail2)
          .end((err, res) => {
            const { token } = res.body;
            testToken2 = token;
            chai
              .request(app)
              .put(`/api/articles/${slug}`)
              .set({ authorization: testToken2, Accept: 'application/json' })
              .send(updateDetails)
              .end((err, res) => {
                expect(res.status).to.equal(403);
                expect(res.body.message).to.equal('You cannot modify an article added by another User');
                done();
              });
          });
      });
    });
    describe('GET an article', () => {
      it('Returns the right response when a paricular article gotten', (done) => {
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
      it('return bookmarked field when article is bookmarked', (done) => {
        chai
          .request(app)
          .delete(`/api/articles/${slug}/bookmark`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .end(() => {
            chai
              .request(app)
              .get(`/api/articles/${slug}`)
              .set({ authorization: testToken, Accept: 'application/json' })
              .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('Article gotten successfully!');
                expect(res.body.article).to.have.property('bookmarked');
                expect(res.body.article.bookmarked).to.be.an('array');
                done();
              });
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

    describe('Add a tag for an article created by the author', () => {
      let tags = {
        tags: ['reactjs', 'angularjs']
      };
      it('Returns a success message when a user adds a tag to an article', (done) => {
        chai
          .request(app)
          .post(`/api/articles/${slug}/tags`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(tags)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Updated article tags successfully');
            expect(res.body.data).to.deep.equal(tags);
            done();
          });
      });
      it('Returns an error message when an unauthenticated user attempts to add a tag to an article', (done) => {
        chai
          .request(app)
          .post(`/api/articles/${slug}/tags`)
          .send(tags)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.message).to.equal('Unauthorized request, please login');
            done();
          });
      });
      it('Returns an error message when a user attempts to add a tag to a non-existent article', (done) => {
        chai
          .request(app)
          .post('/api/articles/non-exstent-article/tags')
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(tags)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
      });
      it('Returns an error message when a user provides a non-list value to the tags key', (done) => {
        tags = { tags: 'reactjs' };
        chai
          .request(app)
          .post(`/api/articles/${slug}/tags`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(tags)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
      });
      it('Returns an error message when a user provides too many values for the request', (done) => {
        tags = {
          tags: ['reactjs', 'angularjs'],
          extraField: 'extraValue'
        };
        chai
          .request(app)
          .post(`/api/articles/${slug}/tags`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(tags)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
      });
      it('Returns an error message when a user provides an empty values for the request', (done) => {
        tags = {
          tags: ''
        };
        chai
          .request(app)
          .post(`/api/articles/${slug}/tags`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(tags)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Please fill the tags field');
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
      it('Returns a success message when an article is disliked', (done) => {
        const reaction = { reaction: -1 };
        chai
          .request(app)
          .post(`/api/articles/${slug}/react`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(reaction)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Successfully updated reaction');
            done();
          });
      });
      it('Returns a success message when a user reverses their reaction', (done) => {
        const reaction = { reaction: -1 };
        chai
          .request(app)
          .post(`/api/articles/${slug}/react`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .send(reaction)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Successfully removed reaction');
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
          reaction: 1,
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
    describe('GET a given number of articles', () => {
      it('Returns the right response when the articles are gotten/fetched', (done) => {
        chai
          .request(app)
          .get('/api/articles/feed/1&10')
          .set({ authorization: testToken, Accept: 'application/json' })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Articles gotten successfully!');
            done();
          });
      });
      it('Returns the required number of articles per request', (done) => {
        chai
          .request(app)
          .get('/api/articles/feed/1&10')
          .set({ authorization: testToken, Accept: 'application/json' })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect((res.body.articles).length).to.equal(10);
            done();
          });
      });
      it('return bookmarked field when article is bookmarked', (done) => {
        chai
          .request(app)
          .post(`/api/articles/${slug}/bookmark`)
          .set({ authorization: testToken, Accept: 'application/json' })
          .end(() => {
            chai
              .request(app)
              .get('/api/articles/feed/1&10')
              .set({ authorization: testToken, Accept: 'application/json' })
              .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('Articles gotten successfully!');
                expect(res.body.articles[0]).to.have.property('bookmarked');
                expect(res.body.articles[0].bookmarked).to.be.an('array');
                done();
              });
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
  describe('POST /articles/bookmark/:slug', () => {
    let userToken;
    let articleSlug;
    beforeEach('add user to db and article to db', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(userDetail)
        .end((err, res) => {
          userToken = res.body.token;
          chai
            .request(app)
            .post('/api/articles')
            .set({ authorization: userToken })
            .send(article)
            .end((err, res) => {
              articleSlug = res.body.article.slug;
              done();
            });
        });
    });
    afterEach('Reset database after each test', (done) => {
      resetDB();

      done();
    });

    it('should bookmark an article', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${articleSlug}/bookmark`)
        .set({ authorization: userToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Article bookmarked successfully');
          expect(res.body.data.articleSlug).to.equal(articleSlug);
          expect(res.body.data).to.have.property('title');
          done();
        });
    });
    it('should return error if specified article is already bookmarked', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${articleSlug}/bookmark`)
        .set({ authorization: userToken, Accept: 'application/json' })
        .end(() => {
          chai
            .request(app)
            .post(`/api/articles/${articleSlug}/bookmark`)
            .set({ authorization: userToken, Accept: 'application/json' })
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body.error).to.equal('Article has been previously bookmarked');
              done();
            });
        });
    });
    it('should return error if specified article does not exist', (done) => {
      chai
        .request(app)
        .post('/api/articles/this-article-does-not-exist/bookmark')
        .set({ authorization: userToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('Article Not found!');
          done();
        });
    });
    it('should return error if token is compromised', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${articleSlug}/bookmark`)
        .set({ authorization: 'thisIsACompromisedTokenItShouldNotWork', Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('jwt malformed');
          done();
        });
    });
    it('should return error if token is not specified', (done) => {
      chai
        .request(app)
        .post(`/api/articles/${articleSlug}/bookmark`)
        .set({ Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Unauthorized request, please login');
          done();
        });
    });
  });
  describe('DELETE /articles/bookmark/:slug', () => {
    let userToken;
    let articleSlug;
    let unbookMarkedArticle;
    beforeEach('add user to db, add articles to db and bookmark one of them', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(userDetail)
        .end((err, res) => {
          userToken = res.body.token;
          chai
            .request(app)
            .post('/api/articles')
            .set({ authorization: userToken })
            .send(article2)
            .end((err, res) => {
              unbookMarkedArticle = res.body.article.slug;
            });
          chai
            .request(app)
            .post('/api/articles')
            .set({ authorization: userToken })
            .send(article)
            .end((err, res) => {
              articleSlug = res.body.article.slug;
              chai
                .request(app)
                .post(`/api/articles/${articleSlug}/bookmark`)
                .set({ authorization: userToken, Accept: 'application/json' })
                .end(() => {
                  done();
                });
            });
        });
    });
    afterEach('Reset database after each test', (done) => {
      resetDB();

      done();
    });

    it('should bookmark an article', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/${articleSlug}/bookmark`)
        .set({ authorization: userToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Bookmark removed successfully');
          done();
        });
    });
    it('should return error if specified article does not exist', (done) => {
      chai
        .request(app)
        .delete('/api/articles/this-article-does-not-exist/bookmark')
        .set({ authorization: userToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('Article Not found!');
          done();
        });
    });
    it('should return error if specified article is not currently bookmarked', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/${unbookMarkedArticle}/bookmark`)
        .set({ authorization: userToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('This article is not currently bookmarked');
          done();
        });
    });
    it('should return error if token is compromised', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/${articleSlug}/bookmark`)
        .set({ authorization: 'thisIsACompromisedTokenItShouldNotWork', Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('jwt malformed');
          done();
        });
    });
    it('should return error if token is not specified', (done) => {
      chai
        .request(app)
        .delete(`/api/articles/${articleSlug}/bookmark`)
        .set({ Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Unauthorized request, please login');
          done();
        });
    });
  });
  describe('GET /articles/all/bookmark', () => {
    let userToken;
    beforeEach('add user to db, add articles to db and bookmark them', (done) => {
      // add user to db
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(userDetail)
        .end((err, res) => {
          userToken = res.body.token;
          // add first article and bookmark
          chai
            .request(app)
            .post('/api/articles')
            .set({ authorization: userToken })
            .send(article2)
            .end((err, res) => {
              const { slug: articleSlug } = res.body.article;
              chai
                .request(app)
                .post(`/api/articles/${articleSlug}/bookmark`)
                .set({ authorization: userToken, Accept: 'application/json' })
                .end();
            });
          // add second article
          chai
            .request(app)
            .post('/api/articles')
            .set({ authorization: userToken })
            .send(article)
            .end((err, res) => {
              const { slug: articleSlug } = res.body.article;
              chai
                .request(app)
                .post(`/api/articles/${articleSlug}/bookmark`)
                .set({ authorization: userToken, Accept: 'application/json' })
                .end(() => {
                  done();
                });
            });
        });
    });
    afterEach('Reset database after each test', (done) => {
      resetDB();

      done();
    });

    it('should return bookmarked articles', (done) => {
      chai
        .request(app)
        .get('/api/articles/all/bookmark')
        .set({ authorization: userToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.have.property('articles');
          expect(res.body.data).to.include({
            articlesCount: 2
          });
          done();
        });
    });
    it('should return error if token is compromised', (done) => {
      chai
        .request(app)
        .get('/api/articles/all/bookmark')
        .set({ authorization: 'thisIsACompromisedTokenItShouldNotWork', Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('jwt malformed');
          done();
        });
    });
    it('should return error if token is not specified', (done) => {
      chai
        .request(app)
        .get('/api/articles/all/bookmark')
        .set({ Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Unauthorized request, please login');
          done();
        });
    });
  });
  describe('GET /articles/author/:authorId', () => {
    let userToken;
    let userId;
    before('add user to db, add articles', (done) => {
      // add user to db
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(userDetail)
        .end((err, res) => {
          userToken = res.body.token;
          const id = res.body.userId;
          userId = id;
          // add first article and bookmark
          chai
            .request(app)
            .post('/api/articles')
            .set({ authorization: userToken })
            .send(article2)
            .end((err, res) => {
              const { slug: articleSlug } = res.body.article;
              chai
                .request(app)
                .post(`/api/articles/${articleSlug}/bookmark`)
                .set({ authorization: userToken, Accept: 'application/json' })
                .end();
            });
          // add second article
          chai
            .request(app)
            .post('/api/articles')
            .set({ authorization: userToken })
            .send(article)
            .end(() => {
              done();
            });
        });
    });
    after('Reset database after each test', (done) => {
      resetDB();

      done();
    });

    it('should return articles authored by specified user', (done) => {
      chai
        .request(app)
        .get(`/api/articles/author/${userId}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles).to.have.lengthOf(2);
          done();
        });
    });
  });
  describe('GET /articles/user/:userId/favorites', () => {
    let userToken;
    let userId;
    before('add user to db, add articles', (done) => {
      // add user to db
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(userDetail)
        .end((err, res) => {
          userToken = res.body.token;
          const id = res.body.userId;
          userId = id;
          // add first article and bookmark
          chai
            .request(app)
            .post('/api/articles')
            .set({ authorization: userToken })
            .send(article2)
            .end((err, res) => {
              const { slug: articleSlug } = res.body.article;
              chai
                .request(app)
                .post(`/api/articles/${articleSlug}/favorite`)
                .set({ authorization: userToken, Accept: 'application/json' })
                .end();
            });
          // add second article
          chai
            .request(app)
            .post('/api/articles')
            .set({ authorization: userToken })
            .send(article)
            .end((err, res) => {
              const { slug: articleSlug } = res.body.article;
              chai
                .request(app)
                .post(`/api/articles/${articleSlug}/favorite`)
                .set({ authorization: userToken, Accept: 'application/json' })
                .end(() => {
                  done();
                });
            });
        });
    });
    after('Reset database after each test', (done) => {
      resetDB();

      done();
    });

    it('should return articles favorited by specified user', (done) => {
      chai
        .request(app)
        .get(`/api/articles/user/${userId}/favorite`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles).to.have.lengthOf(2);
          done();
        });
    });
  });
});
