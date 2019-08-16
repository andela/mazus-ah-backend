
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import jwtDecode from 'jwt-decode';
import app from '..';
import seededUsers from './mockData/seededUsers';
import mockUsers from './mockData/mockUsers';
import models from '../database/models';

chai.use(chaiHttp);

const url = '/api/v1/admin/users';
const baseUrl = '/api/v1/admin';
const { expect } = chai;
const { Comment } = models;
let verifiedUserToken;
let adminToken;
const userId = '356304da-50bc-4488-9c85-88874a9efb16';
let unverifiedUserToken;

describe('Admin Routes', () => {
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(mockUsers[15])
      .end(() => { });
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(seededUsers[3])
      .end((err, res) => {
        const { token } = res.body.user;
        verifiedUserToken = token;
        done();
      });
  });
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(seededUsers[0])
      .end((err, res) => {
        const { token } = res.body.user;
        unverifiedUserToken = token;
        done();
      });
  });
  it('should successfully get all users', (done) => {
    chai
      .request(app)
      .get(`${url}`)
      .set('Authorization', `Bearer ${verifiedUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.allUsers.users[0]).to.have.property('id');
        expect(res.body.allUsers.users[0]).to.have.property('firstName');
        expect(res.body.allUsers.users[0]).to.have.property('lastName');
        done();
      });
  });
  it('should successfully create an admin', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/createuser`)
      .set('Authorization', `Bearer ${verifiedUserToken}`)
      .send(mockUsers[17])
      .end((err, res) => {
        const { token } = res.body.user;
        const decoded = jwtDecode(token);
        expect(res.status).to.eql(201);
        expect(res.body.user.message).to.eql('Account has been created successfully!');
        expect(res.body.user).to.have.property('token');
        expect(decoded.type).to.eql('admin');

        done();
      });
  });
  it('should not successfully create an admin when using a normal user token', (done) => {
    chai
      .request(app)
      .post(`${baseUrl}/createuser`)
      .set('Authorization', `Bearer ${unverifiedUserToken}`)
      .send(mockUsers[17])
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body.errors.message).to.eql('User not authorized');
        done();
      });
  });
  it('should successfully update a user\'s email', (done) => {
    chai
      .request(app)
      .patch(`${url}/${userId}`)
      .set('Authorization', `Bearer ${verifiedUserToken}`)
      .send(mockUsers[18])
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.user).to.be.a('object');
        expect(res.body.user.message).to.eql('User has been updated');
        done();
      });
  });
  it('should successfully ban a user" ', (done) => {
    chai
      .request(app)
      .patch(`${baseUrl}/ban/${userId}`)
      .set('Authorization', `Bearer ${verifiedUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.user).to.be.a('object');
        expect(res.body.user.message).to.eql('User has been banned successfully');
        done();
      });
  });
  it('should not successfully ban a user twice" ', (done) => {
    chai
      .request(app)
      .patch(`${baseUrl}/ban/${userId}`)
      .set('Authorization', `Bearer ${verifiedUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.user).to.be.a('object');
        expect(res.body.user.message).to.eql('User has already been banned');
        done();
      });
  });
  it('should successfully unban a user" ', (done) => {
    chai
      .request(app)
      .patch(`${baseUrl}/unban/${userId}`)
      .set('Authorization', `Bearer ${verifiedUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.user).to.be.a('object');
        expect(res.body.user.message).to.eql('User has been unbanned successfully');
        done();
      });
  });
  it('should not successfully unban a user twice" ', (done) => {
    chai
      .request(app)
      .patch(`${baseUrl}/unban/${userId}`)
      .set('Authorization', `Bearer ${verifiedUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.user).to.be.a('object');
        expect(res.body.user.message).to.eql('User has already been unbanned');
        done();
      });
  });
  it('should successfully update a user\'s type to an "admin" ', (done) => {
    chai
      .request(app)
      .patch(`${url}/${userId}`)
      .set('Authorization', `Bearer ${verifiedUserToken}`)
      .send(mockUsers[18])
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.user).to.be.a('object');
        expect(res.body.user.message).to.eql('User has been updated');
        done();
      });
  });
  it('should successfully delete a user', (done) => {
    chai
      .request(app)
      .delete(`${url}/${userId}`)
      .set('Authorization', `Bearer ${verifiedUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.user).to.be.a('object');
        expect(res.body.user.message).to.eql('User has been deleted');
        done();
      });
  });
  it('should throw an error if user has been deleted already', (done) => {
    chai
      .request(app)
      .delete(`${url}/${userId}`)
      .set('Authorization', `Bearer ${verifiedUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body.errors).to.be.a('object');
        expect(res.body.errors.user).to.eql('User not found');
        done();
      });
  });

  it('should throw an error if user to be updated does not exist', (done) => {
    chai
      .request(app)
      .patch(`${url}/${userId}`)
      .set('Authorization', `Bearer ${verifiedUserToken}`)
      .send(mockUsers[18])
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body.errors).to.be.a('object');
        expect(res.body.errors.user).to.eql('User not found');
        done();
      });
  });
});

describe('Testing admin routes for articles and comments', () => {
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'alex.kamali@outlook.com', password: 'P455w0rd' })
      .end((err, res) => {
        const { token } = res.body.user;
        adminToken = token;
        done();
      });
  });
  it('should return a success response for deleting an article', (done) => {
    chai
      .request(app)
      .delete('/api/v1/admin/articles/Skull-is-9563-3e4ea280efb9')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.be.a('object');
        expect(res.body.article.message).to.eql('Article has been deleted');
        done();
      });
  });
  it('should return an error message for attempting to delete an article again', (done) => {
    chai
      .request(app)
      .delete('/api/v1/admin/articles/Skull-is-9563-3e4ea280efb9')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.be.a('object');
        expect(res.body.errors.article).to.eql('Article not found');
        done();
      });
  });

  it('should return a success response for deleting a comment', (done) => {
    chai
      .request(app)
      .delete('/api/v1/admin/comments/6675f038-8c66-4485-9dcf-4660ac27ccd5')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.be.a('object');
        expect(res.body.comment.message).to.eql('Comment has been deleted');
        done();
      });
  });
  it('should return an error message for attempting to delete a comment again', (done) => {
    chai
      .request(app)
      .delete('/api/v1/admin/comments/6675f038-8c66-4485-9dcf-4660ac27ccd5')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.be.a('object');
        expect(res.body.errors.comment).to.eql('Comment not found');
        done();
      });
  });
  it('should throw a server error', (done) => {
    const stub = sinon.stub(Comment, 'destroy');
    const error = new Error('Something went wrong');
    stub.yields(error);
    chai.request(app)
      .delete('/api/v1/admin/comments/6675f038-8c66-4485-9dcf-4660ac27ccd0')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        done();
      });
  });
});
