import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import correctUser from './mockData/mockUser';

chai.use(chaiHttp);

const { expect } = chai;
const url = '/api/v1';

describe('User signup tests', () => {
  describe('test for user signup', () => {
    it('Should register a user successfully when all fields are inputed correctly', (done) => {
      chai
        .request(app)
        .post(`${url}/auth/signup`)
        .send(correctUser)
        .end((err, res) => {
          expect(res.status).to.eql(201);
          expect(res.body.message).to.eql('Your Account has been created successfully!');
          expect(res.body.user).to.have.property('token');
          expect(res.body.user).to.have.property('isVerified');
          expect(res.body.user).to.have.property('email');
          done();
        });
    });
    it('Should return an error when an email already exist', (done) => {
      chai
        .request(app)
        .post(`${url}/auth/signup`)
        .send(correctUser)
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
