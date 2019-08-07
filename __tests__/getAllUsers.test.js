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
      email: 'johndoe@test.com',
      password: 'passwordHash',
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
