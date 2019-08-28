import dotenv from 'dotenv';

dotenv.config();
const MarkUps = {
  verified: `
    <center>
    <img src = ${process.env.APP_LOGO}>
    <h1 style='font-family:helvetica;'>Your email has been verified</h1>
    </center>
    `,
  alreadyVerified: `
    <center>
    <img src = ${process.env.APP_LOGO}>
    <h1 style='font-family:helvetica;'>Your email has already been verified</h1>
    </center>
    `,
  incorrectCredentials: `
    <center>
    <img src = ${process.env.APP_LOGO}>
    <h1 style='font-family:helvetica;'>Your credentials are incorrect</h1>
    </center>
    `,
};
export default MarkUps;
