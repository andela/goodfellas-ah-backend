import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../server';
import resetDB from '../helpers/resetDB';

const should = chai.should();

chai.use(chaiHttp);

let token;

describe('Articles controller', () => {
	beforeEach((done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send({
          "firstname": "Anthony",
          "lastname": "Ugwu",
          "email": "anthonyugwu@gmail.com",
          "password": "myPassword"
        })
        .end((err, res) => {
        	token = res.body.token
      		done();
        });
    });

  	after((done) => {
    	resetDB.resetDB();

    	done();
  	});

  	describe('GET all the articles', () => {
  		// Please remove when working on this feature
  		it('(DUMMY TEST) GET to /api/articles should return all the articles', done => {
  			chai
				.request(app)
        		.get('/api/articles')
        		.set({ 'authorization': token, Accept: 'application/json' })
        		.end((err, res) => {
          			expect(res.status).to.equal(200);
          			expect(res.body.message).to.equal('All Articles Retrieved Successfully');
          			done();
        		});
  		});
 	});
});