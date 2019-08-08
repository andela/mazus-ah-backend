import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';
import models from '../database/models';

chai.use(chaiHttp);

const url = '/api/v1';
const { expect } = chai;
const { Article, Reading } = models;
const blacklistedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiSm9obiIsImlhdCI6MTU2NDAwOTA5NCwiZXhwIjoxNTY0MDEyNjk0fQ.J5ktoXlmLxOtV8R16sNPMXXeydwRdCA8h6Cep-AzZnc';


describe('Reading statistics for articles published by an author', () => {
  let userToken;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'john.kamali@outlook.com', password: 'P455w0rd' })
      .end((err, res) => {
        userToken = res.body.user.token;
        done();
      });
  });
  it('should return an array of objects in another object', (done) => {
    chai.request(app)
      .get(`${url}/profiles/articlesreadcount`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.allArticlesStatistics[1].id).to.eql('a2cda7e8-28ba-4507-9563-3e4ea280efb6');
        expect(res.body.allArticlesStatistics[1].title).to.eql('Skull is coming to town');
        expect(res.body.allArticlesStatistics[1].slug).to.eql('Skull-is-9563-3e4ea280efb6');
        expect(res.body.allArticlesStatistics[1].userId).to.eql('e89695aa-1f7e-468c-89dd-5fc2332e31f1');
        expect(res.body.allArticlesStatistics[1].readCount).to.eql(0);
        done();
      });
  });
  it('should return an error response when token is not provided', (done) => {
    chai.request(app)
      .get(`${url}/profiles/articlesreadcount`)
      .set('Authorization', '')
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('No token provided');
        done();
      });
  });
  it('should return an error response when an invalid token is provided', (done) => {
    chai.request(app)
      .get(`${url}/profiles/articlesreadcount`)
      .set('Authorization', `Bearer ${userToken}s`)
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
      .get(`${url}/profiles/articlesreadcount`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('Your account has not been verified, please verify to continue');
        done();
      });
  });
  it('should return an error response when a blacklisted token is provided', (done) => {
    chai.request(app)
      .get(`${url}/profiles/articlesreadcount`)
      .set('Authorization', `Bearer ${blacklistedToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body.errors.message).to.eql('Invalid token provided, please sign in');
        done();
      });
  });
  it('should throw a server error', (done) => {
    const stub = sinon.stub(Article, 'findAll');
    const error = new Error('Something went wrong');
    stub.yields(error);
    chai.request(app)
      .get(`${url}/profiles/articlesreadcount`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        done();
      });
  });
});

describe('Reading statistics for articles an author or user has read', () => {
  let userToken;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'john.kamali@outlook.com', password: 'P455w0rd' })
      .end((err, res) => {
        userToken = res.body.user.token;
        done();
      });
  });
  it('should return an error response when token is not provided', (done) => {
    chai.request(app)
      .get(`${url}/profiles/myreadcount`)
      .set('Authorization', '')
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('No token provided');
        done();
      });
  });
  it('should return number of articles user read', (done) => {
    chai.request(app)
      .get(`${url}/profiles/myreadcount`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.body.articlesRead).to.eql(0);
        done();
      });
  });
  it('should return an error response when an invalid token is provided', (done) => {
    chai.request(app)
      .get(`${url}/profiles/myreadcount`)
      .set('Authorization', `Bearer ${userToken}s`)
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
      .get(`${url}/profiles/myreadcount`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('Your account has not been verified, please verify to continue');
        done();
      });
  });
  it('should return an error response when a blacklisted token is provided', (done) => {
    chai.request(app)
      .get(`${url}/profiles/myreadcount`)
      .set('Authorization', `Bearer ${blacklistedToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body.errors.message).to.eql('Invalid token provided, please sign in');
        done();
      });
  });
  it('should throw a server error of 500', (done) => {
    const stub = sinon.stub(Reading, 'findAll');
    const error = new Error('Something went wrong');
    stub.yields(error);
    chai.request(app)
      .get(`${url}/profiles/myreadcount`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        done();
      });
  });
});
