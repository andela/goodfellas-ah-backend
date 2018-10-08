// import chai, { expect } from 'chai';
// import chaiHttp from 'chai-http';
// import { app } from '../server';
// import { resetDB } from './resetTestDB';

// chai.use(chaiHttp);
// let id;
// let testToken;

// describe('Profile controller', () => {
//   before((done) => {
//     chai
//       .request(app)
//       .post('/api/auth/signup')
//       .send({
//         firstname: 'Anthony',
//         lastname: 'Ugwu',
//         email: 'ty@gmail.com',
//         password: 'myPassword'
//       })
//       .end((err, res) => {
//         const { userId, token } = res.body;
//         id = userId;
//         testToken = token;
//         done();
//       });
//   });

//   after((done) => {
//     resetDB();

//     done();
//   });

//   describe('GET a user profile', () => {
//     it('GET /api/profile/user should return a users profile', (done) => {
//       chai
//         .request(app)
//         .get(`/api/profile/user/${id}`)
//         .end((err, res) => {
//           expect(res.status).to.equal(200);
//           done();
//         });
//     });
//   });
//   describe('Check user', () => {
//     it('GET /api/profile/user should return an error if user does not exist', (done) => {
//       chai
//         .request(app)
//         .get('/api/profile/user/0')
//         .end((err, res) => {
//           expect(res.status).to.equal(409);
//           done();
//         });
//     });
//   });

//   describe('update profile', () => {
//     describe('update profile', () => {
//       it('PUT /api/profile/user should return an error if any field is undefined', (done) => {
//         chai
//           .request(app)
//           .put('/api/profile/user')
//           .set({ authorization: testToken, Accept: 'application/json' })
//           .send({
//             username: 'test'
//           })
//           .end((err, res) => {
//             expect(res.status).to.equal(400);
//             expect(res.body.message).to.equal('All fields are required');
//             done();
//           });
//       });
//     });
//     it('PUT /api/profile/user should return an error if Image is not provided', (done) => {
//       chai
//         .request(app)
//         .put('/api/profile/user')
//         .set({ authorization: testToken, Accept: 'application/json' })
//         .field('username', 'crunchy')
//         .field('bio', '')
//         .end((err, res) => {
//           expect(res.status).to.equal(400);
//           expect(res.body.message).to.equal('profileImage field is required');
//           done();
//         });
//     });
//   });
// });
