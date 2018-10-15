import chai from 'chai';
import utility from '../lib/utility';

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
});
