import chai from 'chai';

const utility = require('../lib/utility');

describe('Utility', () => {
  let encryptedPassword;

  it('should encrypt a plain text password and return a hash', async () => {
    const password = 'myPassword';
    encryptedPassword = await utility.encryptPassword(password);
    chai.expect(encryptedPassword).to.include('$2b$');
    chai.expect(encryptedPassword).to.have.lengthOf(60);
  });

  it('should compare passwords and return a negative match', async () => {
    const password = 'notMyPassword';
    const match = await utility.comparePasswords(password, encryptedPassword);
    chai.expect(match).to.equal(false);
  });

  it('should compare passwords and return a positive match', async () => {
    const password = 'myPassword';
    const match = await utility.comparePasswords(password, encryptedPassword);
    chai.expect(match).to.equal(true);
  });

  it('should create a token for an authenticated user', async () => {
    const user = { id: 1 };
    const token = await utility.createToken(user);
    chai.expect(token).to.have.lengthOf(137);
  });

  it('should trim the values that are submitted', async () => {
    const values = {
      firstname: 'myFirstName   '
    };
    const trimmedValues = utility.trimValues(values);
    chai.expect(trimmedValues.firstname).to.equal('myFirstName');
  });

  it('should send email successfully', async () => {
    const email = 'johndoe@gmail.com';
    const mailMessage = 'Welcome to Andela';
    const sendingEmail = utility.sendEmail(email, mailMessage);
    chai.expect(sendingEmail).to.equal('Email has been sent successfully');
  });

  it('should fail when email is not passed', async () => {
    const email = '';
    const mailMessage = 'Welcome to Andela';
    const sendingEmail = utility.sendEmail(email, mailMessage);
    chai.expect(sendingEmail).to.equal(false);
  });
});
