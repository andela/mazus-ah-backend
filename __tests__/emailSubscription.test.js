import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';


chai.use(chaiHttp);
const url = '/api/v1';
const { expect } = chai;
const blacklistedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiSm9obiIsImlhdCI6MTU2NDAwOTA5NCwiZXhwIjoxNTY0MDEyNjk0fQ.J5ktoXlmLxOtV8R16sNPMXXeydwRdCA8h6Cep-AzZnc';

describe('Subscribing to email notifications', () => {
  let firstUserToken;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'fatima.kamali@outlook.com', password: 'P455w0rd' })
      .end((err, res) => {
        firstUserToken = res.body.user.token;
        done();
      });
  });
  it('should return a success response when a user unsubscribes', (done) => {
    chai.request(app)
      .patch(`${url}/users/emailNotify`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.subscription).to.eql('You have unsubscribed for email notifications');
        done();
      });
  });
  it('should return a success response when a user subscribes', (done) => {
    chai.request(app)
      .patch(`${url}/users/emailNotify`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.subscription.message).to.eql('You have subscribed for email notifications');
        done();
      });
  });
  let secondUserToken;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'sophie.kamali@outlook.com', password: 'P455w0rd' })
      .end((err, res) => {
        secondUserToken = res.body.user.token;
        done();
      });
  });
  it('should return an error response if the user is unverified', (done) => {
    chai.request(app)
      .patch(`${url}/users/emailNotify`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('Your account has not been verified, please verify to continue');
        done();
      });
  });
  it('should return an error response if token is unavailable', (done) => {
    chai.request(app)
      .patch(`${url}/users/emailNotify`)
      .set('Authorization', '')
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('No token provided');
        done();
      });
  });
  it('should return an error response if token is in the blacklist', (done) => {
    chai.request(app)
      .patch(`${url}/users/emailNotify`)
      .set('Authorization', `Bearer ${blacklistedToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body.errors.message).to.eql('Invalid token provided, please sign in');
        done();
      });
  });
  it('should return an error response if token is invalid', (done) => {
    chai.request(app)
      .patch(`${url}/users/emailNotify`)
      .set('Authorization', `Bearer ${secondUserToken}s`)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body.errors.message).to.eql('Invalid token provided');
        done();
      });
  });
});
