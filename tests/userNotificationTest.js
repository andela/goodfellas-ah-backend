import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import io from 'socket.io-client';
import { app } from '../server';
import { resetDB } from './resetTestDB';
import { User } from '../models';
import eventEmitter from '../lib/eventEmitter';
import { article, userADetails, userBDetails } from './testDetails';

chai.use(chaiHttp);
const socketURL = 'http://localhost:3000/';
const socketOptions = {
  transports: ['websocket'],
  'force new connection': true
};
describe('Notification Settings', () => {
  after((done) => {
    resetDB();

    done();
  });
  describe('When article is created', () => {
    let userAToken;
    let userBToken;
    let userAId;
    const articleCreatedSpy = sinon.spy();
    const notificationCreatedSpy = sinon.spy();
    const userBNotificationSpy = sinon.spy();
    eventEmitter.on('article created', articleCreatedSpy);
    eventEmitter.on('notification created', notificationCreatedSpy);
    beforeEach('add users to db, userB follow userA, create article', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(userADetails)
        .end((err, res) => {
          userAToken = res.body.token;
          User.findOne({ where: { email: userADetails.email } }).then((userA) => {
            userAId = userA.id;
            chai
              .request(app)
              .post('/api/auth/signup')
              .send(userBDetails)
              .end((err, res) => {
                userBToken = res.body.token;
                const userBSocket = io.connect(`${socketURL}?token=${userBToken}`, socketOptions);
                userBSocket.on('new notification', userBNotificationSpy);
                chai
                  .request(app)
                  .post(`/api//user/follow/${userAId}`)
                  .set('authorization', userBToken)
                  .send()
                  .end(() => {
                    chai
                      .request(app)
                      .post('/api/articles')
                      .set({ authorization: userAToken, Accept: 'application/json' })
                      .send(article)
                      .end(() => {
                        done();
                      });
                  });
              });
          });
        });
    });
    afterEach('Reset database after each test', async () => resetDB());
    it("should emit event 'article created'", (done) => {
      expect(articleCreatedSpy.called).to.equal(true);
      done();
    });
    it('should create notification for userB', (done) => {
      setTimeout(() => {
        chai
          .request(app)
          .get('/api/user/notification')
          .set({ authorization: userBToken })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Notifications retrieved successfully');
            expect(res.body.data.count).to.equal(1);
            expect(notificationCreatedSpy.called).to.equal(true);
            done();
          });
      }, 2000);
    });
    it("should emit socket event 'new notification' for userB", (done) => {
      setTimeout(() => {
        expect(userBNotificationSpy.called).to.equal(true);
        done();
      }, 2000);
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
  describe('PUT /user/notification/off/:setting', () => {
    let userToken;
    beforeEach('add user to db', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(userADetails)
        .end((err, res) => {
          userToken = res.body.token;
          done();
        });
    });
    afterEach('Reset database', (done) => {
      resetDB();

      done();
    });

    it('should turn specified notification off', (done) => {
      chai
        .request(app)
        .put('/api/user/notification/off/email')
        .set({ authorization: userToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Notification setting successfully updated');
          done();
        });
    });
    it('should return error if setting is currently off', (done) => {
      // turn notification off
      chai
        .request(app)
        .put('/api/user/notification/off/email')
        .set({ authorization: userToken, Accept: 'application/json' })
        .end(() => {
          // attempt to turn notification off again
          chai
            .request(app)
            .put('/api/user/notification/off/email')
            .set({ authorization: userToken, Accept: 'application/json' })
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body.message).to.equal('You currently do not have this setting enabled');
              done();
            });
        });
    });
    it('should return error while passing wrong parameter', (done) => {
      chai
        .request(app)
        .put('/api/user/notification/off/wrong')
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
        .put('/api/user/notification/off/email')
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
        .put('/api/user/notification/off/email')
        .set({ Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Unauthorized request, please login');
          done();
        });
    });
  });
  describe('PUT /user/notification/off/:setting', () => {
    let userToken;
    beforeEach('add user to db', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(userADetails)
        .end((err, res) => {
          userToken = res.body.token;
          done();
        });
    });
    afterEach('Reset database', (done) => {
      resetDB();

      done();
    });

    it('should turn specified notification off', (done) => {
      chai
        .request(app)
        .put('/api/user/notification/off/email')
        .set({ authorization: userToken, Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Notification setting successfully updated');
          done();
        });
    });
    it('should return error if setting is currently off', (done) => {
      // turn notification off
      chai
        .request(app)
        .put('/api/user/notification/off/email')
        .set({ authorization: userToken, Accept: 'application/json' })
        .end(() => {
          // attempt to turn notification off again
          chai
            .request(app)
            .put('/api/user/notification/off/email')
            .set({ authorization: userToken, Accept: 'application/json' })
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body.message).to.equal('You currently do not have this setting enabled');
              done();
            });
        });
    });
    it('should return error while passing wrong parameter', (done) => {
      chai
        .request(app)
        .put('/api/user/notification/off/wrong')
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
        .put('/api/user/notification/off/email')
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
        .put('/api/user/notification/off/email')
        .set({ Accept: 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Unauthorized request, please login');
          done();
        });
    });
  });
});
