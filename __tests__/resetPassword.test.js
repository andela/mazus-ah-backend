import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';

chai.use(chaiHttp);

const url = '/api/v1';
const { expect } = chai;
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

  it('should return an error if password is not validated', (done) => {
    const userPassword = {
      password: '',
      confirmPassword: '',
    };
    chai
      .request(app)
      .patch(`${url}/auth/resetpassword/${jwToken}`)
      .send(userPassword)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.errors.password).to.eql('Password is required');
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
