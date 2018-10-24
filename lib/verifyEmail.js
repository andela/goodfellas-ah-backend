/* eslint arrow-body-style: 0 */

const verifyEmail = (encryptedToken) => {
  return `
  <div>
  <p style='padding: 15px'>Welcome to Authors Haven!!</p>
  <p style='padding: 15px'>Verify your account here ${process.env.BASE_URL}/api/auth/verification/${encryptedToken}</p>
</div>
`;
};

export default verifyEmail;
