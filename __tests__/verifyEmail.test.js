import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';
import models from '../database/models';
import mockUsersToVerify from './mockData/mockUsersToVerify';
import MarUps from '../helpers/MarkUps';

chai.use(chaiHttp);

const url = '/api/v1';
const { expect } = chai;
const { User } = models;
const { userToVerify, secondUserToVerify, thirdUserToVerify } = mockUsersToVerify;
const { verified, alreadyVerified, incorrectCredentials } = MarUps;

describe('verifying a user email', () => {
  let verificationCode;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(userToVerify)
      .end((err, res) => {
        verificationCode = res.body.user.verificationToken;
        done();
      });
  });
  it('should return a success response object when a user successfully verifies an email', (done) => {
    chai.request(app)
      .get(`${url}/auth/verify?email=${userToVerify.email}&token=${verificationCode}`)
      .end((err, res) => {
        expect(res.text).to.eql(verified);
        done();
      });
  });
  it('should tell user email has already been verified if so', (done) => {
    chai.request(app)
      .get(`${url}/auth/verify?email=${userToVerify.email}&token=${verificationCode}`)
      .end((err, res) => {
        expect(res.text).to.eql(alreadyVerified);
        done();
      });
  });
  let secondVerificationCode;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(secondUserToVerify)
      .end((err, res) => {
        secondVerificationCode = res.body.user.verificationToken;
        done();
      });
  });
  it('should throw an error when user attempts to verify an email with the wrong information', (done) => {
    chai.request(app)
      .get(`${url}/auth/verify?email=${secondUserToVerify.email}&token=${secondVerificationCode.slice(0, 34)}`)
      .end((err, res) => {
        expect(res.text).to.eql(incorrectCredentials);
        done();
      });
  });
  let thirdVerificationCode;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(thirdUserToVerify)
      .end((err, res) => {
        thirdVerificationCode = res.body.user.verificationToken;
        done();
      });
  });
  it('should throw a server error when user attempts to verify an email', (done) => {
    const stub = sinon.stub(User, 'update');
    const error = new Error('Something went wrong');
    stub.yields(error);
    chai.request(app)
      .get(`${url}/auth/verify?email=${thirdUserToVerify.email}&token=${thirdVerificationCode}`)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        done();
      });
  });
});
