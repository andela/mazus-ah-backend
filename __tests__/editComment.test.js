import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '..';
import models from '../database/models';


chai.use(chaiHttp);
const url = '/api/v1';
const { expect } = chai;
const { Comment } = models;
const blacklistedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiSm9obiIsImlhdCI6MTU2NDAwOTA5NCwiZXhwIjoxNTY0MDEyNjk0fQ.J5ktoXlmLxOtV8R16sNPMXXeydwRdCA8h6Cep-AzZnc';
const commentId = '6675f038-8c66-4485-9dcf-4660ac27ccd9';

describe('Testing edit comment endpoint', () => {
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
  let thirdUserToken;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'john.kamali@outlook.com', password: 'P455w0rd' })
      .end((err, res) => {
        thirdUserToken = res.body.user.token;
        done();
      });
  });
  it('should return an error response if the user is unverified', (done) => {
    chai.request(app)
      .patch(`${url}/comments/${commentId}`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .send({ body: 'This is brilliant' })
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('Your account has not been verified, please verify to continue');
        done();
      });
  });
  it('should return an error response if token is unavailable', (done) => {
    chai.request(app)
      .patch(`${url}/comments/${commentId}`)
      .set('Authorization', '')
      .send({ body: 'This is brilliant' })
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('No token provided');
        done();
      });
  });
  it('should return an error response if token is in the blacklist', (done) => {
    chai.request(app)
      .patch(`${url}/comments/${commentId}`)
      .set('Authorization', `Bearer ${blacklistedToken}`)
      .send({ body: 'This is brilliant' })
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('Invalid token provided, please sign in');
        done();
      });
  });
  it('should return an error response if token is invalid', (done) => {
    chai.request(app)
      .patch(`${url}/comments/${commentId}`)
      .set('Authorization', `Bearer ${firstUserToken}s`)
      .send({ body: 'This is brilliant' })
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('Invalid token provided');
        done();
      });
  });
  it('should return an error response for an empty comment', (done) => {
    chai
      .request(app)
      .patch(`${url}/comments/${commentId}`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send({ body: '' })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.body).to.eql('comment body is required');
        done();
      });
  });
  it('should return an error response when a user tries to edit another user\'s comment', (done) => {
    chai
      .request(app)
      .patch(`${url}/comments/${commentId}`)
      .set('Authorization', `Bearer ${thirdUserToken}`)
      .send({ body: 'Stop that' })
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.eql('You are not allowed to edit another user\'s comment');
        done();
      });
  });
  it('should return an error response when a user attempts to edit a non existing comment', (done) => {
    chai
      .request(app)
      .patch(`${url}/comments/7675f038-8c66-4485-9dcf-4660ac27ccd9`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send({ body: 'This is brilliant' })
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.have.property('errors');
<<<<<<< HEAD
        expect(res.body.errors.message).to.eql('Comment does not exist');
=======
        expect(res.body.errors).to.eql('That comment does not exist');
>>>>>>> feature(comment) user can edit comment
        done();
      });
  });
  it('should return a success response when a comment has been edited', (done) => {
    chai
      .request(app)
      .patch(`${url}/comments/${commentId}`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send({ body: 'This is brilliant' })
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('comment');
        expect(res.body.comment.id).to.eql('6675f038-8c66-4485-9dcf-4660ac27ccd9');
        expect(res.body.comment.userId).to.eql('6675f038-8c66-4485-9dcf-4660ac27ccd1');
        expect(res.body.comment.articleId).to.eql('a2cda7e8-28ba-4507-9563-3e4ea280efb6');
        expect(res.body.comment.body).to.eql('This is brilliant');
        done();
      });
  });
  it('should throw a server error', (done) => {
    const stub = sinon.stub(Comment, 'update');
    const error = new Error('Something went wrong');
    stub.yields(error);
    chai.request(app)
      .patch(`${url}/comments/${commentId}`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send({ body: 'This is brilliant' })
      .end((err, res) => {
        expect(res.status).to.eql(500);
        done();
      });
  });
});
