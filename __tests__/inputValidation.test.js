import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';
import mockUsers from './mockData/mockUsers';

chai.use(chaiHttp);

const { expect } = chai;
const url = '/api/v1';
describe('User tests', () => {
  it('should return status 400 when all required fields are missing', (done) => {
    chai.request(app)
      .post(`${url}/auth/signup`)
      .send(mockUsers[0])
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.email).eql('Email is required');
        expect(res.body.errors.firstName).eql('First name is required');
        expect(res.body.errors.lastName).eql('Last name is required');
        expect(res.body.errors.password).eql('Password is required');
        done();
      });
  });
  it('should return status 400 if the email input is invalid', (done) => {
    chai.request(app)
      .post(`${url}/auth/signup`)
      .send(mockUsers[1])
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.email).eql('Please input a valid email address');
        done();
      });
  });
  it('should return status 400 if the password input does not match required expectation', (done) => {
    chai.request(app)
      .post(`${url}/auth/signup`)
      .send(mockUsers[2])
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.password)
          .eql('Password must contain at least one uppercase letter, one lowercase letter and one numeric digit');
        done();
      });
  });
  it('should return status 400 if the password length is less than 8 characters', (done) => {
    chai.request(app)
      .post(`${url}/auth/signup`)
      .send(mockUsers[3])
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.password).eql('Password must be at least 8 characters');
        done();
      });
  });
  it('should successfully signup a user if the parameters are valid', (done) => {
    chai.request(app)
      .post(`${url}/auth/signup`)
      .send(mockUsers[4])
      .end((err, res) => {
        expect(res.status).eql(201);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('firstName');
        expect(res.body.user).to.have.property('lastName');
        expect(res.body.user.email).eql(mockUsers[4].email);
        expect(res.body.user.firstName).eql(mockUsers[4].firstName);
        expect(res.body.user.lastName).eql(mockUsers[4].lastName);
        done();
      });
  });
});
