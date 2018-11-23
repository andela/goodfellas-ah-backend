import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import { resetDB } from './resetTestDB';
import { User } from '../models';
import { userADetails, userBDetails, userCDetails } from './testDetails';

chai.use(chaiHttp);

describe('User controller', () => {
  const rootUrl = '/api';
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

  describe('POST /user/follow/:userId', () => {
    let userAToken;
    let userBToken;
    let userBId;
    beforeEach('add users to db before each test', async () => {
      const userASignUp = await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userADetails);
      const userBSignUp = await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userBDetails);
      const userB = await User.findOne({ where: { email: userBDetails.email } });
      userBId = userB.dataValues.id;
      userAToken = userASignUp.body.token;
      userBToken = userBSignUp.body.token;
    });
    afterEach('Reset database after each test', async () => resetDB());

    it('should allow signed in userA to follow specified userB', async () => {
      const response = await chai
        .request(app)
        .post(`${rootUrl}/user/follow/${userBId}`)
        .set('authorization', userAToken)
        .send();

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal(`You're now following ${userBDetails.firstname} ${userBDetails.lastname}`);
    });
    it('should return error on attempt to follow the same user twice', async () => {
      await chai
        .request(app)
        .post(`${rootUrl}/user/follow/${userBId}`)
        .set('authorization', userAToken)
        .send();
      const response = await chai
        .request(app)
        .post(`${rootUrl}/user/follow/${userBId}`)
        .set('authorization', userAToken)
        .send();

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Error: You\'re already following this user');
    });
    it('should return error on attempt to follow oneself', async () => {
      const response = await chai
        .request(app)
        .post(`${rootUrl}/user/follow/${userBId}`)
        .set('authorization', userBToken)
        .send();

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Error: You cannot follow yourself');
    });
    it('should return error if token is compromised', async () => {
      const response = await chai
        .request(app)
        .post(`${rootUrl}/user/follow/${userBId}`)
        .set('authorization', 'userATokenIsNowCompromisedThisShouldReturnAnError')
        .send();

      expect(response).to.have.status(401);
      expect(response.body.message).to.equal('jwt malformed');
    });
    it('should return error if token is not given', async () => {
      const response = await chai
        .request(app)
        .post(`${rootUrl}/user/follow/${userBId}`)
        .send();

      expect(response).to.have.status(401);
      expect(response.body.message).to.equal('Unauthorized request, please login');
    });
  });
  describe('DELETE /user/follow/:userId', () => {
    let userAToken;
    let userBId;
    let userCId;
    beforeEach('add users to db, userA follow userB before each test', async () => {
      const userASignUp = await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userADetails);
      await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userBDetails);
      await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userCDetails);
      const userB = await User.findOne({ where: { email: userBDetails.email } });
      const userC = await User.findOne({ where: { email: userCDetails.email } });
      userBId = userB.dataValues.id;
      userCId = userC.dataValues.id;
      userAToken = userASignUp.body.token;
      await chai
        .request(app)
        .post(`${rootUrl}/user/follow/${userBId}`)
        .set('authorization', userAToken)
        .send();
    });
    afterEach('Reset database after each test', async () => resetDB());

    it('should allow signed in userA to unfollow specified userB', async () => {
      const response = await chai
        .request(app)
        .delete(`${rootUrl}/user/follow/${userBId}`)
        .set('authorization', userAToken)
        .send({ userId: userBId });

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal(`You unfollowed ${userBDetails.firstname} ${userBDetails.lastname}`);
    });
    it('should return error if specified user does not exist', async () => {
      const response = await chai
        .request(app)
        .delete(`${rootUrl}/user/follow/${userBId + 3}`)
        .set('authorization', userAToken)
        .send();

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Error: User doen\'t exist');
    });
    it('should return error if specified user is not currently followed', async () => {
      const response = await chai
        .request(app)
        .delete(`${rootUrl}/user/follow/${userCId}`)
        .set('authorization', userAToken)
        .send();

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('You\'re not following this user');
    });
    it('should return error if token is compromised', async () => {
      const response = await chai
        .request(app)
        .delete(`${rootUrl}/user/follow/${userBId}`)
        .set('authorization', 'userATokenIsNowCompromisedThisShouldReturnAnError')
        .send();

      expect(response).to.have.status(401);
      expect(response.body.message).to.equal('jwt malformed');
    });
    it('should return error if token is not given', async () => {
      const response = await chai
        .request(app)
        .delete(`${rootUrl}/user/follow/${userBId}`)
        .send();

      expect(response).to.have.status(401);
      expect(response.body.message).to.equal('Unauthorized request, please login');
    });
  });
  describe('GET /user/followed/:userId', () => {
    let userAToken;
    let userCToken;
    let userBId;
    let userCId;
    beforeEach('add users to db, userC follow userB before each test', async () => {
      const userASignUp = await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userADetails);
      const userCSignUp = await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userCDetails);
      await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userBDetails);
      const userB = await User.findOne({ where: { email: userBDetails.email } });
      const userC = await User.findOne({ where: { email: userCDetails.email } });
      userCId = userC.dataValues.id;
      userBId = userB.dataValues.id;
      userAToken = userASignUp.body.token;
      userCToken = userCSignUp.body.token;
      await chai
        .request(app)
        .post(`${rootUrl}/user/follow/${userBId}`)
        .set('authorization', userCToken)
        .send();
    });
    afterEach('Reset database after each test', async () => resetDB());

    it('should return users that are currently followed by userC', async () => {
      const response = await chai
        .request(app)
        .get(`${rootUrl}/user/followed/${userCId}`)
        .set('authorization', userAToken)
        .send();
      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data).to.have.property('followedUsers');
      expect(response.body.data).to.include({
        followedUsersCount: 1
      });
      expect(response.body.message).to.equal('Retrieved followed users');
    });
    it('should return error if specified user does not exist', async () => {
      const response = await chai
        .request(app)
        .get(`${rootUrl}/user/followed/${userBId + 3}`)
        .set('authorization', userAToken)
        .send();

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Error: User doen\'t exist');
    });
  });
  describe('GET /user/followers/:userId', () => {
    let userAToken;
    let userBToken;
    let userCId;
    beforeEach('add users to db, userA and userB follow userC before each test', async () => {
      const userASignUp = await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userADetails);
      const userBSignUp = await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userBDetails);
      await chai
        .request(app)
        .post(`${rootUrl}/auth/signup`)
        .send(userCDetails);
      const userC = await User.findOne({ where: { email: userCDetails.email } });
      userCId = userC.dataValues.id;
      userAToken = userASignUp.body.token;
      userBToken = userBSignUp.body.token;
      await chai
        .request(app)
        .post(`${rootUrl}/user/follow/${userCId}`)
        .set('authorization', userAToken)
        .send();
      await chai
        .request(app)
        .post(`${rootUrl}/user/follow/${userCId}`)
        .set('authorization', userBToken)
        .send();
    });
    afterEach('Reset database after each test', async () => resetDB());

    it('should return users that currently follow userC', async () => {
      const response = await chai
        .request(app)
        .get(`${rootUrl}/user/followers/${userCId}`)
        .set('authorization', userAToken)
        .send();

      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data).to.have.property('followers');
      expect(response.body.data).to.include({
        followersCount: 2
      });
      expect(response.body.message).to.equal('Retrieved followers');
    });
    it('should return error if specified user does not exist', async () => {
      const response = await chai
        .request(app)
        .get(`${rootUrl}/user/followed/${userCId + 3}`)
        .set('authorization', userAToken)
        .send();
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Error: User doen\'t exist');
    });
  });
  describe('PUT /user/notification/on/:setting', () => {
    let userToken;
    beforeEach('add user to db and turn email notification off', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(userADetails)
        .end((err, res) => {
          userToken = res.body.token;
          chai
            .request(app)
            .put('/api/user/notification/off/email')
            .set({ authorization: userToken, Accept: 'application/json' })
            .end(() => {
              done();
            });
        });
    });
    afterEach('Reset database', (done) => {
      resetDB();

      done();
    });

    it('should turn specified notification on', (done) => {
      chai
        .request(app)
        .put('/api/user/notification/on/email')
        .set({ authorization: userToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Notification setting successfully updated');
          done();
        });
    });
    it('should return error if setting is currently on', (done) => {
      chai
        .request(app)
        .put('/api/user/notification/on/inApp')
        .set({ authorization: userToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('You already have this setting enabled');
          done();
        });
    });
    it('should return error while passing wrong parameter', (done) => {
      chai
        .request(app)
        .put('/api/user/notification/on/wrong')
        .set({ authorization: userToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal("Set 'setting' to 'email', or 'inApp'.");
          done();
        });
    });
    it('should return error if token is compromised', (done) => {
      chai
        .request(app)
        .put('/api/user/notification/on/email')
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
        .put('/api/user/notification/on/email')
        .set({ Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Unauthorized request, please login');
          done();
        });
    });
  });
});
