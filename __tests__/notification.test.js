/* eslint-disable no-unused-vars */
import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import app from '..';
import models from '../database/models';
import mockArticles from './mockData/mockArticles';

chai.use(chaiHttp);
const url = '/api/v1';
const { expect } = chai;
const { Notification } = models;
const blacklistedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiSm9obiIsImlhdCI6MTU2NDAwOTA5NCwiZXhwIjoxNTY0MDEyNjk0fQ.J5ktoXlmLxOtV8R16sNPMXXeydwRdCA8h6Cep-AzZnc';


describe('Fetching user notifications', () => {
  let authorToken;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'john.kamali@outlook.com', password: 'P455w0rd' })
      .end((err, res) => {
        authorToken = res.body.user.token;
        done();
      });
  });
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
  before((done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .send(mockArticles[6])
      .set('Authorization', `Bearer ${authorToken}`)
      .end((err, res) => {
        done();
      });
  });
  it('should return a success response for fetching user notifications', (done) => {
    chai.request(app)
      .get(`${url}/notifications`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.notification[0]).to.have.property('payload');
        expect(res.body.notification[0].payload).to.be.a('object');
        expect(res.body.notification[0].read).to.eql(false);
        expect(res.body.notification[0].type).to.eql('new article');
        done();
      });
  });
  it('should return an error response when token is not provided', (done) => {
    chai.request(app)
      .get(`${url}/notifications`)
      .set('Authorization', '')
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('No token provided');
        done();
      });
  });
  it('should return an error response when a blacklisted token is provided', (done) => {
    chai.request(app)
      .get(`${url}/notifications`)
      .set('Authorization', `Bearer ${blacklistedToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body.errors.message).to.eql('Invalid token provided, please sign in');
        done();
      });
  });
  it('should return an error response when an invalid token is provided', (done) => {
    chai.request(app)
      .get(`${url}/notifications`)
      .set('Authorization', `Bearer ${firstUserToken}s`)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body.errors.message).to.eql('Invalid token provided');
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
  it('should return an error response if the user has not been verified', (done) => {
    chai.request(app)
      .get(`${url}/notifications`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('Your account has not been verified, please verify to continue');
        done();
      });
  });
});

describe('Marking a user notification as read', () => {
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
  let notificationId;
  before((done) => {
    chai.request(app)
      .get(`${url}/notifications`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .end((err, res) => {
        notificationId = res.body.notification[0].id;
        done();
      });
  });
  it('should return a success response for marking a user notification as read', (done) => {
    chai.request(app)
      .patch(`${url}/notifications/${notificationId}`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.notification).to.eql('Notifications successfully updated to read');
        done();
      });
  });
  it('should return an error response when a notification could not be marked as read', (done) => {
    chai.request(app)
      .patch(`${url}/notifications/36be022b-fc45-4cf1-80bf-6c1bf9b952c3`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.errors).to.eql('Notification was not updated succesfully');
        done();
      });
  });
  it('should throw a server error when attempting to mark a notification as read', (done) => {
    const stub = sinon.stub(Notification, 'update');
    const error = new Error('Something went wrong');
    stub.yields(error);
    chai.request(app)
      .patch(`${url}/notifications/${notificationId}`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        done();
      });
  });
  it('should return an error response when token is not provided', (done) => {
    chai.request(app)
      .patch(`${url}/notifications/${notificationId}`)
      .set('Authorization', '')
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('No token provided');
        done();
      });
  });
  it('should return an error response when a blacklisted token is provided', (done) => {
    chai.request(app)
      .patch(`${url}/notifications/${notificationId}`)
      .set('Authorization', `Bearer ${blacklistedToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body.errors.message).to.eql('Invalid token provided, please sign in');
        done();
      });
  });
  it('should return an error response when an invalid token is provided', (done) => {
    chai.request(app)
      .patch(`${url}/notifications/${notificationId}`)
      .set('Authorization', `Bearer ${firstUserToken}s`)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body.errors.message).to.eql('Invalid token provided');
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
  it('should return an error response if the user has not been verified', (done) => {
    chai.request(app)
      .patch(`${url}/notifications/${notificationId}`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('Your account has not been verified, please verify to continue');
        done();
      });
  });
});
