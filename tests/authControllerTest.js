import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import resetDB from '../helpers/resetDB';

const should = chai.should();

chai.use(chaiHttp);

describe('Authentication controller', () => {
  beforeEach((done) => {
    resetDB.resetDB();

    done();
  });
  
	describe('Signup a new user', () => {
		it('POST to /auth/signup should create a user successfully', done => {
			chai
				.request(app)
        		.post('/api/auth/signup')
        		.send({
        			"firstname": "Adinoyi",
        			"lastname": "Sadiq",
          			"email": "adinoyi@gmail.com",
          			"password": "myPassword"
        		})
        		.end((err, res) => {
          			expect(res.status).to.equal(201);
          			expect(res.body.token).to.be.a('string');
          			done();
        		});
		})
	});
});