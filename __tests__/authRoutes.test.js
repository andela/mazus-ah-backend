import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwtDecode from 'jwt-decode';
import app from '..';
import models from '../database/models';
import mockUsers from './mockData/mockUsers';
import seededUsers from './mockData/seededUsers';


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
          const { token } = res.body.user;
          const decoded = jwtDecode(token);
          expect(res.status).to.eql(201);
          expect(res.body.user.message).to.eql('Account has been created successfully!');
          expect(res.body.user).to.have.property('token');
          expect(decoded.email).to.eql(mockUsers[5].email);
          expect(decoded.firstName).to.eql(mockUsers[5].firstName);
          expect(decoded.lastName).to.eql(mockUsers[5].lastName);
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
          expect(res.body.errors.message).to.eql('This User already exist');
          done();
        });
    });
  });
  it('should return an error when password and confirmPassword does not match', (done) => {
    chai
      .request(app)
      .post(`${url}/auth/signup`)
      .send(mockUsers[9])
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.errors.password).to.eql('Passwords don\'t match.');
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

describe('test for user login', () => {
  it('should login a user account successfully', (done) => {
    chai
      .request(app)
      .post(`${url}/auth/signin`)
      .send(mockUsers[6])
      .end((err, res) => {
        const { token } = res.body.user;
        const decoded = jwtDecode(token);
        expect(res.status).to.eql(200);
        expect(res.body.user.message).to.eql('You have successfully logged in');
        expect(res.body.user).to.have.property('token');
        expect(decoded.emailAddress).to.eql(mockUsers[6].email);
        expect(decoded).to.have.property('firstName');
        expect(decoded).to.have.property('lastName');
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
        expect(res.body.errors).to.have.property('message');
        expect(res.body.errors.message).to.eql('You Entered an incorrect Email or Password');
        done();
      });
  });
  it('should return an error when user is banned', (done) => {
    chai
      .request(app)
      .post(`${url}/auth/signin`)
      .send(seededUsers[4])
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors).to.have.property('message');
        expect(res.body.errors.message).to.eql('You Have been banned, Please contact an admin');
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
        expect(res.body.errors).to.have.property('message');
        expect(res.body.errors.message).to.eql('You Entered an incorrect Email or Password');
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


describe('Auth Routes Test', () => {
  before((done) => {
    const user = {
      firstName: 'Darth',
      lastName: 'Vader',
      email: 'darthsss@vader.com',
      password: 'Pasusword12',
      confirmPassword: 'Pasusword12',
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
        expect(res.status).to.eql(401);
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
