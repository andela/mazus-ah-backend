import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import correctUser from './mockData/mockUser';

chai.use(chaiHttp);

const { expect } = chai;
const url = '/api/v1';

describe('User signup tests', () => {
  describe('test for user signup', () => {
    it('should register a user successfully when all fields are inputed correctly', (done) => {
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
          expect(res.body.user.email).to.eql(correctUser.email);
          done();
        });
    });
    it('should return an error when an email already exist', (done) => {
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
