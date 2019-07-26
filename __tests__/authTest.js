/* eslint-disable quotes */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from  '../index';

chai.use(chaiHttp);
const { expect } = chai;

const url = 'api/v1';
let token;

 describe('User signup tests', () => {
    describe('test for user signup',  () => {
        it('Should register a user successfully when all fields are inputed correctly', (done) => {
            chai.request(app)
            .post(`${url}/auth/signup`)
            .send(userObject)
            .end((err, res) => {
                token = req.body.user.verificationToken
            }

        })
    })  

}
const userDetails = {
  firstName: 'Victor',
  lastname: 'Ajayi',
  email: 'saintyommex@gmail.com',
  password: 'bankas'
};

const secondUserDetails = {
  firstName: 'Victor',
  lastname: 'Ajayi',
  email: 'victor.abayomi@outlook.com',
  password: 'bankas'
};

describe('Verifying an email', () => {
  let verificationCode;
  before((done) => {
    chai.request(app)
      .post(`${url}/auth/signin`)
      .send(userDetails)
      .end((err, res) => {
        verificationCode = res.body.user.verificationToken;
        done();
      });
  });
  it('A successful email verification should return a response object indicating success', (done) => {
    chai.request(app)
      .patch(`${url}/auth/${userDetails.email}/${verificationCode}`)
      .end((err, res) => {
        expect(res.status).eql(200);
        expect(res.body.message).eql('Email verified');
        expect(res.body.isVeried).eql(true);
        done();
      });
  });
  let secondVerificationCode;
  before((done) => {
    chai.request(app)
      .post(`${url}/auth/signin`)
      .send(userDetails)
      .end((err, res) => {
        secondVerificationCode = res.body.user.verificationToken;
        done();
      });
  });
  it('Attempting to verify an email with the wrong credentials should throw an error message', (done) => {
    chai.request(app)
      .patch(`${url}/auth/${secondUserDetails.email}/${secondVerificationCode}`)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body.message).eql('Incorrect Credentials');
        expect(res.body.isVeried).eql(false);
        done();
      });
  });
  it('Attempting to verify an unregistered user should throw an error message', (done) => {
    chai.request(app)
      .patch(`${url}/auth/nouser@outlook.com/${secondVerificationCode}`)
      .end((err, res) => {
        expect(res.status).eql(404);
        expect(res.body.message).eql('User not found');
        done();
      });
  });
});
