import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';
import models from '../database/models';
import mockUsers from './mockData/mockUsers';
import mockUsersToVerify from './mockData/mockUsersToVerify';

chai.use(chaiHttp);

const API_PREFIX = '/api/v1/auth';
const url = '/api/v1';
const { expect } = chai;
const { userToVerify, secondUserToVerify, thirdUserToVerify } = mockUsersToVerify;
const { BlacklistedToken, User } = models;
let validUserToken;
const blacklistedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiSm9obiIsImlhdCI6MTU2NDAwOTA5NCwiZXhwIjoxNTY0MDEyNjk0fQ.J5ktoXlmLxOtV8R16sNPMXXeydwRdCA8h6Cep-AzZnc';

describe('User signup tests', () => {
  describe('test for user signup', () => {
    it('should register a user successfully when all fields are inputed correctly', (done) => {
      chai
        .request(app)
        .post(`${url}/auth/signup`)
        .send(mockUsers[5])
        .end((err, res) => {
          expect(res.status).to.eql(201);
          expect(res.body.message).to.eql('Your Account has been created successfully!');
          expect(res.body.user).to.have.property('token');
          expect(res.body.user).to.have.property('isVerified');
          expect(res.body.user).to.have.property('email');
          expect(res.body.user.email).to.eql(mockUsers[5].email);
          done();
        });
    });
    it('should return an error when an email already exist', (done) => {
      chai
        .request(app)
        .post(`${url}/auth/signup`)
        .send(mockUsers[5])
        .end((err, res) => {
          expect(res.status).to.eql(409);
          expect(res.body.message).to.eql('This User already exist');
          done();
        });
    });
  });
});


describe('verifying an email', () => {
  const signupUser = userData => chai.request(app)
    .post('/api/v1/auth/signup')
    .send(userData);

  it('a successful email verification should return a success response object', (done) => {
    signupUser(userToVerify)
      .end((err, res) => {
        console.log('<<<<<<<>>>>>>>>', res.body);
        const verificationCode = res.body.user.verificationToken;
        chai.request(app)
          .patch(`${url}/auth/verify?email=${userToVerify.email}&token=${verificationCode}`)
          .end((err, res) => {
            expect(res.status).to.eql(200);
            expect(res.body.message).to.eql('Email Verified');
            expect(res.body.isVerified).to.eql(true);
            done();
          });
      });
  });

  // it('attempting to verify an email with invalid details should throw an error', (done) => {
  //   signupUser(secondUserToVerify)
  //     .end((err, res) => {
  //       const secondVerificationCode = res.body.user.verificationToken;
  //       chai.request(app)
  //         .patch(`${url}/auth/verify?email=${secondUserToVerify.email}&token=${secondVerificationCode.slice(0, 34)}`)
  //         .end((err, res) => {
  //           expect(res.status).to.eql(400);
  //           expect(res.body.message).to.eql('Incorrect Credentials');
  //           expect(res.body.isVerified).to.eql(false);
  //           done();
  //         });
  //     });
  // });

  // it('it should throw an internal server error upon email verification', (done) => {
  //   signupUser(thirdUserToVerify)
  //     .end((err, res) => {
  //       const thirdVerificationCode = res.body.user.verificationToken;
  //       const stub = sinon.stub(User, 'update');
  //       const error = new Error('Something went wrong');
  //       stub.yields(error);
  //       chai.request(app)
  //         .patch(`${url}/auth/verify?email=${thirdUserToVerify.email}&token=${thirdVerificationCode}`)
  //         .end((err, res) => {
  //           expect(res.status).to.eql(500);
  //           done();
  //         });
  //     });
  // });
});
describe('test for user login', () => {
  it('should login a user account successfully', (done) => {
    chai
      .request(app)
      .post(`${url}/auth/signin`)
      .send(mockUsers[6])
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.message).to.eql('You have successfully logged in');
        expect(res.body.user).to.have.property('token');
        expect(res.body.user).to.have.property('isVerified');
        expect(res.body.user).to.have.property('email');
        expect(res.body.user.email).to.eql(mockUsers[6].email);
        done();
      });
  });

  it('should return an error when an email is wrong', (done) => {
    chai
      .request(app)
      .post(`${url}/auth/signin`)
      .send(mockUsers[7])
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.eql('You Entered an incorrect Email or Password');
        done();
      });
  });

  it('should return an error when password is wrong', (done) => {
    chai
      .request(app)
      .post(`${url}/auth/signin`)
      .send(mockUsers[8])
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.eql('You Entered an incorrect Email or Password');
        done();
      });
  });
});


describe('Auth Routes Test', () => {
  before((done) => {
    const user = {
      firstName: 'Darth',
      lastName: 'Vader',
      email: 'darthsss@vader.com',
      password: 'Password12'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
      .send(user)
      .end((err, res) => {
        const { token } = res.body.user;
        validUserToken = token;
        done();
      });
  });

  it('should throw 401 status code accessing the logout route without a token', (done) => {
    chai
      .request(app)
      .post(`${API_PREFIX}/logout`)
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('No token provided');
        done();
      });
  });

  it('should not let a logged out user make a request', (done) => {
    chai
      .request(app)
      .post(`${API_PREFIX}/logout`)
      .set('Authorization', `Bearer ${blacklistedToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body)
          .to.have.property('errors')
          .to.be.a('object');
        expect(res.body.errors.message).to.eql('Invalid token provided, please sign in');
        done();
      });
  });

  it('should not let a user with an invalid token make a request', (done) => {
    chai
      .request(app)
      .post(`${API_PREFIX}/logout`)
      .set('Authorization', '')
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body)
          .to.have.property('errors')
          .to.be.a('object');
        expect(res.body).to.have.nested.property('errors.message');
        expect(res.body.errors.message).to.eql('No token provided');
        done();
      });
  });

  it('should log out a user', (done) => {
    chai
      .request(app)
      .post(`${API_PREFIX}/logout`)
      .set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body)
          .to.have.property('data')
          .to.be.a('object');
        expect(res.body.data)
          .to.have.property('message')
          .to.be.a('string')
          .to.be.eql('Successfully logged out');
        done();
      });
  });

  it('should throw a 500 status code when an error occurs on the server', (done) => {
    const stub = sinon
      .stub(BlacklistedToken, 'create')
      .rejects(new Error('Foreign Key constraint'));
    chai
      .request(app)
      .post(`${API_PREFIX}/logout`)
      .set('Authorization', `${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        stub.restore();
        done();
      });
  });
});
