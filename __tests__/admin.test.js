
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';
import seededUsers from './mockData/seededUsers';
import mockUsers from './mockData/mockUsers';

chai.use(chaiHttp);

const url = '/api/v1/admin/users';
const { expect } = chai;
let verifiedUserToken;
const userId = '356304da-50bc-4488-9c85-88874a9efb16';

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
  it('should successfully create a user', (done) => {
    chai
      .request(app)
      .post(`${url}`)
      .set('Authorization', `Bearer ${verifiedUserToken}`)
      .send(mockUsers[17])
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body.message).to.eql('Your Account has been created successfully!');
        expect(res.body.user).to.have.property('token');
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
