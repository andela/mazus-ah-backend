import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

const url = '/api/v1/users';
const { expect } = chai;
let validToken;
let userId;

describe('Testing GET users endpoint', () => {
  before((done) => {
    const user = {
      email: 'pelumi@test.com',
      password: 'PasswoRD123__',
    };
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        const { token } = res.body.user;
        userId = res.body.user.id;
        validToken = token;
        done();
      });
  });
  it('should get all Users successfully', (done) => {
    chai
      .request(app)
      .get(url)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.users).to.have.property('message');
        expect(res.body.users.message).to.eql('Users fetched successfully');
        expect(res.body.users).to.be.a('object');
        expect(res.body.users).to.have.property('allUsers');
        expect(res.body.users.allUsers[0]).to.have.property('id');
        expect(res.body.users.allUsers[0]).to.have.property('firstName');
        expect(res.body.users.allUsers[0]).to.have.property('lastName');
        expect(res.body.users.allUsers[0]).to.have.property('email');
        expect(res.body.users.allUsers[0]).to.have.property('isVerified');
        expect(res.body.users.allUsers[0]).to.have.property('type');
        expect(res.body.users.allUsers[0]).to.have.property('emailNotify');
        expect(res.body.users.allUsers[0]).to.have.property('profile');
        expect(res.body.users.allUsers[0].firstName).to.eql('Aana');
        expect(res.body.users.allUsers[0].lastName).to.eql('Bella');
        expect(res.body.users.allUsers[0].email).to.eql('BA@test.com');
        expect(res.body.users.allUsers[0].isVerified).to.eql(true);
        expect(res.body.users.allUsers[0].emailNotify).to.eql(true);
        done();
      });
  });
  it('should return error 400 if id is invalid', (done) => {
    chai.request(app)
      .get(`${url}/11d509cc-b787-f-b176-fdb63cb9ed44/bookmarks`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(400);
        expect(res.body.errors.id).to.eql('id is not valid');
        done();
      });
  });
  it('should return error 400 if id is invalid', (done) => {
    chai.request(app)
      .get(`${url}/11d509cc-b787-4abf-b176-fdb63cb9ed44/bookmarks`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(403);
        expect(res.body.errors).to.eql('You are not allowed to view this user\'s bookmarks');
        done();
      });
  });
  it('should get all users successfully', (done) => {
    chai
      .request(app)
      .get(`${url}/${userId}/bookmarks`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.bookmarks).to.have.property('message');
        expect(res.body.bookmarks.message).to.eql('Bookmarks fetched successfully');
        expect(res.body.bookmarks).to.be.a('object');
        done();
      });
  });
});
