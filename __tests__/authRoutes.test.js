import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';
import models from '../database/models';
import mockUsers from './mockData/mockUsers';

chai.use(chaiHttp);

const API_PREFIX = '/api/v1/auth';
const url = '/api/v1';
const { expect } = chai;
const { BlacklistedToken } = models;
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
  const userToVerify = {
    firstName: 'Victor',
    lastName: 'Ajayi',
    email: 'saintyommex@gmail.com',
    password: 'P455w0rd',
  };
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
  it('a successful email verification should return a success response object', (done) => {
    chai.request(app)
      .patch(`${url}/auth/verify?email=${userToVerify.email}&token=${verificationCode}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.message).to.eql('Email Verified');
        expect(res.body.isVerified).to.eql(true);
        done();
      });
  });
  const secondUserToVerify = {
    firstName: 'Victor',
    lastName: 'Ajayi',
    email: 'seconduser@outlook.com',
    password: 'P455w0rd'
  };
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
  it('attempting to verify an email with invalid details should throw an error', (done) => {
    chai.request(app)
      .patch(`${url}/auth/verify?email=${secondUserToVerify.email}&token=${secondVerificationCode.slice(0, 34)}`)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.message).to.eql('Incorrect Credentials');
        expect(res.body.isVerified).to.eql(false);
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

describe('Reset Password Test', () => {
  const userEmail = {
    email: 'johndoe@test.com',
  };
  let jwToken;
  before((done) => {
    chai
      .request(app)
      .post(`${url}/auth/forgotpassword`)
      .send(userEmail)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.email).to.eql(userEmail.email);
        expect(res.body.message).to.eql('Your reset link has been sent to your email');
        const { token } = res.body;
        jwToken = token;
        done();
      });
  });

  it('should throw an error if the user does not already have an account', (done) => {
    const fakeUserEmail = {
      email: 'johnoluwa@test.com',
    };
    chai
      .request(app)
      .post(`${url}/auth/forgotpassword`)
      .send(fakeUserEmail)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body.errors.message).to.eql('You are not an existing user, please sign up');
        done();
      });
  });

  it('should return an error when you use a generic password', (done) => {
    const userPassword = {
      password: 'Password123',
      confirmPassword: 'Password123',
    };
    chai
      .request(app)
      .patch(`${url}/auth/resetpassword/${jwToken}`)
      .send(userPassword)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.errors.message).to.eql('Do not use a common word as the password');
        done();
      });
  });

  it('should return an error when password and confirmPassword does not match', (done) => {
    const userPassword = {
      password: 'allMyGuysAreBallers1$$',
      confirmPassword: 'allMyGuysAreNotBallers%%',
    };
    chai
      .request(app)
      .patch(`${url}/auth/resetpassword/${jwToken}`)
      .send(userPassword)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.errors.message).to.eql('Password doesn\'t match, Please check you are entering the right thing!');
        done();
      });
  });

  it('should successfully reset users password', (done) => {
    const userPassword = {
      password: 'allMyGuysAreBallers1$$',
      confirmPassword: 'allMyGuysAreBallers1$$',
    };
    chai
      .request(app)
      .patch(`${url}/auth/resetpassword/${jwToken}`)
      .send(userPassword)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.message).to.eql('Your Password has been reset successfully');

        done();
      });
  });

  it('should throw an error if the token is used more than once', (done) => {
    const userPassword = {
      password: 'allMyGuysAreBallers1$$',
      confirmPassword: 'allMyGuysAreBallers1$$',
    };
    chai
      .request(app)
      .patch(`${url}/auth/resetpassword/${jwToken}`)
      .send(userPassword)
      .end((err, res) => {
        expect(res.status).to.eql(409);
        expect(res.body.errors.message).to.eql('This link has already been used once, please request another link.');
        done();
      });
  });
});
