// user log in details
const userDetail = {
  firstname: 'Anthony',
  lastname: 'Ugwu',
  email: 'goodfellas@gmail.com',
  password: 'password'
};
const adminDetail = {
  firstname: process.env.firstname,
  lastname: process.env.lastname,
  email: process.env.email,
  password: process.env.password,
};
const userDetail2 = {
  firstname: 'john',
  lastname: 'doe',
  email: 'johndoe@gmail.com',
  password: 'password'
};

export {
  userDetail,
  adminDetail,
  userDetail2,
};
