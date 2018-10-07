import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';
import { User } from '../models';

chai.use(chaiHttp);

describe('User controller', () => {
  const rootUrl = '/api';
  const userADetails = {
    firstname: 'Jane',
    lastname: 'Doegirl',
    email: 'jane@doegirl.com',
    password: 'myPassword'
  };
  const userBDetails = {
    firstname: 'John',
    lastname: 'Doeis',
    email: 'john@doeis.com',
    password: 'johnspassword'
  };
  after((done) => {
    resetDB();

    done();
  });

  describe('Signup a new user', () => {
    it('POST to /auth/signup should create a user successfully', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send({
          firstname: 'Adinoyi',
          lastname: 'Sadiq',
          email: 'adinoyi@gmail.com',
          password: 'myPassword'
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('Should return an error message when the user tries to sign up with an already existing email', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send({
          firstname: 'Adinoyi',
          lastname: 'Sadiq',
          email: 'adinoyi@gmail.com',
          password: 'myPassword'
        })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.message).to.equal('Email is in use');
          done();
        });
    });

    it('Should return an error message when the user tries to sign up with no data', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send({
          firstname: '',
          lastname: '',
          email: '',
          password: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Please fill the firstname, lastname, email, and password fields');
          done();
        });
    });

    it('Should return an error message when the user tries to sign up with a missing field', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send({
          firstname: 'Adinoyi',
          lastname: 'Sadiq',
          email: '',
          password: 'myPassword'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Please fill the email field');
          done();
        });
    });

    it('Should return an error message when the user tries to sign up after passing more than the required fields', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send({
          firstname: 'Adinoyi',
          lastname: 'Sadiq',
          email: 'myemail@gmail.com',
          password: 'password',
          occupation: 'Software developer'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Too many fields');
          done();
        });
    });
  });

  describe('Signin a new user', () => {
    beforeEach((done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send({
          firstname: 'Adinoyi',
          lastname: 'Sadiq',
          email: 'sadiqadinoyi@gmail.com',
          password: 'myPassword'
        })
        .end(() => {
          done();
        });
    });
    afterEach((done) => {
      resetDB();

      done();
    });

    it('POST should create an authenticate a user using username and password', (done) => {
      chai
        .request(app)
        .post('/api/auth/signin')
        .send({
          email: 'sadiqadinoyi@gmail.com',
          password: 'myPassword'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('Should return an error message when the user tries to sign in with an incorrect email', (done) => {
      chai
        .request(app)
        .post('/api/auth/signin')
        .send({
          email: 'wrongemail@gmail.com',
          password: 'myPassword'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('The account with this email does not exist');
          done();
        });
    });

    it('Should return an error message when the user tries to sign in with an incorrect password', (done) => {
      chai
        .request(app)
        .post('/api/auth/signin')
        .send({
          email: 'sadiqadinoyi@gmail.com',
          password: 'wrongPassword'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Incorrect email or password');
          done();
        });
    });

    it('Should return an error message when the user tries to sign in with no data', (done) => {
      chai
        .request(app)
        .post('/api/auth/signin')
        .send({
          email: '',
          password: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Please fill the email, and password fields');
          done();
        });
    });

    it('Should return an error message when the user tries to sign in with a missing field', (done) => {
      chai
        .request(app)
        .post('/api/auth/signin')
        .send({
          email: 'myemail@gmail.com',
          password: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Please fill the password field');
          done();
        });
    });

    it('Should return an error message when the user tries to sign in after passing more than the required fields', (done) => {
      chai
        .request(app)
        .post('/api/auth/signin')
        .send({
          email: 'myemail@gmail.com',
          password: 'password',
          occupation: 'Software developer'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Too many fields');
          done();
        });
    });
  });

  describe('POST /user/follow', () => {
    const route = '/user/follow';
    let userAToken;
    let userBId;
    beforeEach('add users to db before each test', async () => {
      const userASignUp = await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userADetails);
      await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userBDetails);
      const userB = await User.findOne({ where: { email: userBDetails.email } });
      userBId = userB.dataValues.id;
      userAToken = userASignUp.body.token;
    });
    afterEach('Reset database after each test', async () => resetDB());

    it('should allow signed in userA to follow specified userB', async () => {
      const response = await chai
        .request(app)
        .post(`${rootUrl}${route}`)
        .set('authorization', userAToken)
        .send({ userId: userBId });

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal(`User ${userBId} followed successfully`);
    });
    it('should return error if token is compromised', async () => {
      const response = await chai
        .request(app)
        .post(`${rootUrl}${route}`)
        .set('authorization', 'userATokenIsNowCompromisedThisShouldReturnAnError')
        .send({ userId: userBId });

      expect(response).to.have.status(401);
      expect(response.body.message).to.equal('jwt malformed');
    });
    it('should return error if token is not given', async () => {
      const response = await chai
        .request(app)
        .post(`${rootUrl}${route}`)
        .send({ userId: userBId });

      expect(response).to.have.status(401);
      expect(response.body.message).to.equal('Unauthorized request, please login');
    });
  });
  describe('POST /user/unfollow', () => {
    const route = '/user/unfollow';
    let userAToken;
    let userBId;
    beforeEach('add users to db, userA follow userB before each test', async () => {
      const userASignUp = await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userADetails);
      await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userBDetails);
      const userB = await User.findOne({ where: { email: userBDetails.email } });
      userBId = userB.dataValues.id;
      userAToken = userASignUp.body.token;
      await chai
        .request(app)
        .post(`${rootUrl}${route}`)
        .set('authorization', userAToken)
        .send({ userId: userBId });
    });
    afterEach('Reset database after each test', async () => resetDB());

    it('should allow signed in userA to unfollow specified userB', async () => {
      const response = await chai
        .request(app)
        .post(`${rootUrl}${route}`)
        .set('authorization', userAToken)
        .send({ userId: userBId });

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal(`User ${userBId} followed successfully`);
    });
    it('should return error if token is compromised', async () => {
      const response = await chai
        .request(app)
        .post(`${rootUrl}${route}`)
        .set('authorization', 'userATokenIsNowCompromisedThisShouldReturnAnError')
        .send({ userId: userBId });

      expect(response).to.have.status(401);
      expect(response.body.message).to.equal('jwt malformed');
    });
    it('should return error if token is not given', async () => {
      const response = await chai
        .request(app)
        .post(`${rootUrl}${route}`)
        .send({ userId: userBId });

      expect(response).to.have.status(401);
      expect(response.body.message).to.equal('Unauthorized request, please login');
    });
  });
});
