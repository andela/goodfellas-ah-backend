import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';
import { userDetail } from './signUpDetails';

chai.use(chaiHttp);

let testToken;

describe('Search Functionality', () => {
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

  describe('Create user, create article and search articles flow', () => {
    it('should create a new article', (done) => {
      const articleDetail1 = {
        title: 'Enough!',
        description: 'This is a call for Revolt',
        body: 'My people the time has come to revolt against this new government',
        image: 'null'
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(articleDetail1)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('should create a new article', (done) => {
      const articleDetail5 = {
        title: 'Tests rule!',
        description: 'This is a call for Revolt',
        body: 'My people the time has come to revolt against this new government',
        image: 'null'
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(articleDetail5)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('should create a new article', (done) => {
      const articleDetail2 = {
        title: 'please don\'t do this',
        description: 'This is a call for Revolt',
        body: 'My people the time has come to revolt against this new government',
        image: 'null'
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(articleDetail2)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('should create a new article', (done) => {
      const articleDetail3 = {
        title: 'work yh?',
        description: 'This is a call for Revolt',
        body: 'My people the time has come to revolt against this new government',
        image: 'null'
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(articleDetail3)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('should create a new article', (done) => {
      const articleDetail4 = {
        title: 'blah',
        description: 'This is a call for Revolt',
        body: 'My people the time has come to revolt against this new government',
        image: 'null'
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(articleDetail4)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('should create a new article', (done) => {
      const articleDetail6 = {
        title: 'home',
        description: 'This is a call for Revolt',
        body: 'My people the time has come to revolt against this new government',
        image: 'null'
      };
      chai
        .request(app)
        .post('/api/articles')
        .set({ authorization: testToken, Accept: 'application/json' })
        .send(articleDetail6)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });

    it('should search by article', (done) => {
      chai
        .request(app)
        .get('/api/articles/search?article=enough&author=false&tag=false')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Success');
          expect(res.body.articles).to.be.a('array');
          done();
        });
    });

    it('should search by author', (done) => {
      chai
        .request(app)
        .get('/api/articles/search?article=false&author=anthony&tag=false')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Success');
          expect(res.body.articles).to.be.a('array');
          done();
        });
    });

    it('should search by article and author', (done) => {
      chai
        .request(app)
        .get('/api/articles/search?article=enough&author=anthony&tag=false')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Success');
          expect(res.body.articles).to.be.a('array');
          done();
        });
    });

    it('should fail to find with no match for article and author', (done) => {
      chai
        .request(app)
        .get('/api/articles/search?article=wrongsearch&author=anthony&tag=false')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('We couldn\'t find any articles.');
          done();
        });
    });

    it('should fail to find with no match for article', (done) => {
      chai
        .request(app)
        .get('/api/articles/search?article=nothingness&author=false&tag=false')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal("We couldn't find any articles.");
          done();
        });
    });

    it('should fail to find with no match for author', (done) => {
      chai
        .request(app)
        .get('/api/articles/search?article=false&author=nothingness&tag=false')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal("We couldn't find any articles.");
          done();
        });
    });

    it('should fail to find match when all inputs are false', (done) => {
      chai
        .request(app)
        .get('/api/articles/search?article=false&author=false&tag=false')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('Please input something');
          done();
        });
    });
  });
});
