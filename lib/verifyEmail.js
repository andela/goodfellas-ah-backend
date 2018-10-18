/* eslint arrow-body-style: 0 */

const verifyEmail = (encryptedToken) => {
  return `
  <div>
  <p style='padding: 15px'>Welcome to Authors Haven!!</p>
  <p style='padding: 15px'>Verify your account here http://localhost:3000/api/auth/verification/${encryptedToken}</p>
</div>
`;
};

export default verifyEmail;
