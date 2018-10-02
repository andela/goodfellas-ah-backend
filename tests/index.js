import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';

const should = chai.should();

chai.use(chaiHttp);

// Describe Authors Haven
describe('Article', () => (
// Testing the landing page
  describe('homepage', () => {
    it('should get the landing page route', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.should.have
              .property('message')
              .eql('Welcome to Author\'s Haven');
            done();
          }
        });
    });

    // Testing get all articles route
    it('should retrieve all articles', (done) => {
      chai
        .request(app)
        .get('/article')
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            res.body.should.have
              .property('status')
              .eql('Success');
            res.body.should.have
              .property('data')
              .eql(res.body.data);
            done();
          }
        });
    });
  })
));
describe('Article2', () => (
// Testing the landing page
  describe('homepage', () => {
    it('should get the landing page route', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.should.have
              .property('message')
              .eql('Welcome to Author\'s Haven');
            done();
          }
        });
    });

    // Testing get all articles route
    it('should retrieve all articles', (done) => {
      chai
        .request(app)
        .get('/article')
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            res.body.should.have
              .property('status')
              .eql('Success');
            res.body.should.have
              .property('data')
              .eql(res.body.data);
            done();
          }
        });
    });
  })
));
describe('Article3', () => (
// Testing the landing page
  describe('homepage', () => {
    it('should get the landing page route', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.should.have
              .property('message')
              .eql('Welcome to Author\'s Haven');
            done();
          }
        });
    });

    // Testing get all articles route
    it('should retrieve all articles', (done) => {
      chai
        .request(app)
        .get('/article')
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.should.have.property('data');
            res.body.should.have
              .property('status')
              .eql('Success');
            res.body.should.have
              .property('data')
              .eql(res.body.data);
            done();
          }
        });
    });
  })
));

describe('User', () => (
  // Testing the landing page
    describe('homepage', () => {
      it('should get the landing page route', (done) => {
        chai
          .request(app)
          .get('/')
          .end((err, res) => {
            if (err) {
              console.log(err);
            } else {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have
                .property('message')
                .eql('Welcome to Author\'s Haven');
              done();
            }
          });
      });
  
      // Testing get all articles route
      it('should retrieve all articles', (done) => {
        chai
          .request(app)
          .get('/article')
          .end((err, res) => {
            if (err) {
              console.log(err);
            } else {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.should.have.property('data');
              res.body.should.have
                .property('status')
                .eql('Success');
              res.body.should.have
                .property('data')
                .eql(res.body.data);
              done();
            }
          });
      });
    })
  ));
