import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import passport from 'passport';
import Strategy from '../lib/mockStrategy';

const { app } = require('../server');
const { resetDB } = require('./resetTestDB');

chai.use(chaiHttp);

let jwtToken;

describe('Social Login Authentication', () => {
  after((done) => {
    resetDB();

    done();
  });

  // UNIT TESTS
  describe('Mock passport strategy', () => {
    it('should fail when strategy name is not declared', (done) => {
      expect(() => passport.use(new Strategy('', () => { }))).to.throw('DevStrategy requires a Strategy name');
      done();
    });

    it('should fail when strategy name is null', (done) => {
      expect(() => passport.use(new Strategy(null, () => { }))).to.throw('DevStrategy requires a Strategy name');
      done();
    });
  });

  // GOOGLE SOCIAL AUTHENTICATION
  describe('Should sign up user', () => {
    it('should sign up and authorize a new user with a google account', (done) => {
      chai
        .request(app)
        .get('/api/auth/google/callback')
        .send({ access_token: 'googleauthtoken' })
        .end((err, res) => {
          jwtToken = res.body.token;
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('User created Successfully');
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('should sign not sign up a user with a wrong or expired access token', (done) => {
      chai
        .request(app)
        .get('/api/auth/google/callback')
        .send({ access_token: 'wronggoogleauthtoken' })
        .end((err, res) => {
          expect(res.error.status).to.equal(401);
          expect(res.error.text).to.equal('Unauthorized');
          expect(res.error.text).to.be.a('string');
          done();
        });
    });

    it('should allow authenticated user access protected route and return no articles since none were created', (done) => {
      chai
        .request(app)
        .get('/api/articles')
        .set({ authorization: jwtToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Article Not found!');
          done();
        });
    });
  });

  describe('Should sign in user', () => {
    it('should sign in and authorize an existing user with a google account', (done) => {
      chai
        .request(app)
        .get('/api/auth/google/callback')
        .send({ access_token: 'googleauthtoken' })
        .end((err, res) => {
          jwtToken = res.body.token;
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Successfully signed in');
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('should sign not sign in a user with a wrong or expired access token', (done) => {
      chai
        .request(app)
        .get('/api/auth/google/callback')
        .send({ access_token: 'notgoogleauthtoken' })
        .end((err, res) => {
          expect(res.error.status).to.equal(401);
          expect(res.error.text).to.equal('Unauthorized');
          expect(res.error.text).to.be.a('string');
          done();
        });
    });

    it('should allow authenticated user access protected route and return no articles since none were created', (done) => {
      chai
        .request(app)
        .get('/api/articles')
        .set({ authorization: jwtToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Article Not found!');
          done();
        });
    });

    it('should not sign in a user with an email registered with another platform other than a google account', (done) => {
      chai
        .request(app)
        .get('/api/auth/google/callback')
        .send({ access_token: 'googleauthtoken' })
        .end((err, res) => {
          jwtToken = res.body.token;
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal("You can't login through this platform");
          expect(res.body.message).to.be.a('string');
          done();
        });
    });
    it('should throw an internal server error if email field is empty', (done) => {
      chai
        .request(app)
        .get('/api/auth/google/callback')
        .send({ access_token: 'googleauthtoken' })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.error).to.equal('Internal server error');
          done();
        });
    });
  });


  // FACEBOOK SOCIAL AUTHENTICATION
  describe('Should sign up user', () => {
    it('should sign up and authorize a new user with a facebook account', (done) => {
      chai
        .request(app)
        .get('/api/auth/facebook/callback')
        .send({ access_token: 'facebookauthtoken' })
        .end((err, res) => {
          jwtToken = res.body.token;
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('User created Successfully');
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('should sign not sign up a user with a wrong or expired access token', (done) => {
      chai
        .request(app)
        .get('/api/auth/facebook/callback')
        .send({ access_token: 'wrongfacebookauthtoken' })
        .end((err, res) => {
          expect(res.error.status).to.equal(401);
          expect(res.error.text).to.equal('Unauthorized');
          expect(res.error.text).to.be.a('string');
          done();
        });
    });

    it('should allow authenticated user access protected route and return no articles since none were created', (done) => {
      chai
        .request(app)
        .get('/api/articles')
        .set({ authorization: jwtToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Article Not found!');
          done();
        });
    });
  });

  describe('Should sign in user', () => {
    it('should sign in and authorize an existing user with a facebook account', (done) => {
      chai
        .request(app)
        .get('/api/auth/facebook/callback')
        .send({ access_token: 'facebookauthtoken' })
        .end((err, res) => {
          jwtToken = res.body.token;
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Successfully signed in');
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('should sign not sign in a user with a wrong or expired access token', (done) => {
      chai
        .request(app)
        .get('/api/auth/facebook/callback')
        .send({ access_token: 'notfacebookauthtoken' })
        .end((err, res) => {
          expect(res.error.status).to.equal(401);
          expect(res.error.text).to.equal('Unauthorized');
          expect(res.error.text).to.be.a('string');
          done();
        });
    });

    it('should allow authenticated user access protected route and return no articles since none were created', (done) => {
      chai
        .request(app)
        .get('/api/articles')
        .set({ authorization: jwtToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Article Not found!');
          done();
        });
    });

    it('should not sign in a user with an email registered with another platform other than a facebook account', (done) => {
      chai
        .request(app)
        .get('/api/auth/facebook/callback')
        .send({ access_token: 'facebookauthtoken' })
        .end((err, res) => {
          jwtToken = res.body.token;
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal("You can't login through this platform");
          expect(res.body.message).to.be.a('string');
          done();
        });
    });
    it('should throw an internal server error if email field is empty', (done) => {
      chai
        .request(app)
        .get('/api/auth/facebook/callback')
        .send({ access_token: 'facebookauthtoken' })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.error).to.equal('Internal server error');
          done();
        });
    });
  });

  // TWITTER SOCIAL AUTHENTICATION
  describe('Should sign up user', () => {
    it('should sign up and authorize a new user with a twitter account', (done) => {
      chai
        .request(app)
        .get('/api/auth/twitter/callback')
        .send({ access_token: 'twitterauthtoken' })
        .end((err, res) => {
          jwtToken = res.body.token;
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('User created Successfully');
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('should sign not sign up a user with a wrong or expired access token', (done) => {
      chai
        .request(app)
        .get('/api/auth/twitter/callback')
        .send({ access_token: 'wrongtwitterauthtoken' })
        .end((err, res) => {
          expect(res.error.status).to.equal(401);
          expect(res.error.text).to.equal('Unauthorized');
          expect(res.error.text).to.be.a('string');
          done();
        });
    });

    it('should allow authenticated user access protected route and return no articles since none were created', (done) => {
      chai
        .request(app)
        .get('/api/articles')
        .set({ authorization: jwtToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Article Not found!');
          done();
        });
    });
  });

  describe('Should sign in user', () => {
    it('should sign in and authorize an existing user with a twitter account', (done) => {
      chai
        .request(app)
        .get('/api/auth/twitter/callback')
        .send({ access_token: 'twitterauthtoken' })
        .end((err, res) => {
          jwtToken = res.body.token;
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Successfully signed in');
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('should sign not sign in a user with a wrong or expired access token', (done) => {
      chai
        .request(app)
        .get('/api/auth/twitter/callback')
        .send({ access_token: 'nottwitterauthtoken' })
        .end((err, res) => {
          expect(res.error.status).to.equal(401);
          expect(res.error.text).to.equal('Unauthorized');
          expect(res.error.text).to.be.a('string');
          done();
        });
    });

    it('should allow authenticated user access protected route and return no articles since none were created', (done) => {
      chai
        .request(app)
        .get('/api/articles')
        .set({ authorization: jwtToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Article Not found!');
          done();
        });
    });

    it('should not sign in a user with an email registered with another platform other than a twitter account', (done) => {
      chai
        .request(app)
        .get('/api/auth/twitter/callback')
        .send({ access_token: 'twitterauthtoken' })
        .end((err, res) => {
          jwtToken = res.body.token;
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal("You can't login through this platform");
          expect(res.body.message).to.be.a('string');
          done();
        });
    });
    it('should throw an internal server error if email field is empty', (done) => {
      chai
        .request(app)
        .get('/api/auth/twitter/callback')
        .send({ access_token: 'twitterauthtoken' })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.error).to.equal('Internal server error');
          done();
        });
    });
  });
});
