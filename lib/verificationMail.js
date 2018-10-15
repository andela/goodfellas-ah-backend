/* eslint arrow-body-style: 0 */

const verificationMail = (encryptedToken) => {
  return `
  <div>
  <p>Welcome to Authors Haven!!</p>
  <br>
  <br>
  <br>
  <p>Verify your account here http://localhost:3000/api/auth/verification/${encryptedToken}</p>
</div>
`;
};

module.exports = verificationMail;
