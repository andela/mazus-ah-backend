import chai from 'chai';
import chaiHttp from 'chai-http';
import jwtDecode from 'jwt-decode';
import app from '..';

chai.use(chaiHttp);
const url = '/api/v1/admin/comments';
const { expect } = chai;
const commentId = '6675f038-8c66-4485-9dcf-4660ac27ccd9';

describe('Testting get comment edit history', () => {
  let authorisedToken;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'jamal.sabri@mail.com', password: 'P455w0rd' })
      .end((err, res) => {
        authorisedToken = res.body.user.token;
        done();
      });
  });

  let unauthorisedUserToken;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'fatima.kamali@outlook.com', password: 'P455w0rd' })
      .end((err, res) => {
        unauthorisedUserToken = res.body.user.token;
        done();
      });
  });

  it('should return an error response if the comment edit history does not exist', (done) => {
    chai.request(app)
      .get(`${url}/b763843a-f223-48f4-99ec-8b6b1e4f179f`)
      .set('Authorization', `Bearer ${authorisedToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        done();
      });
  });
  it('should get all comment edit history for a comment', (done) => {
    chai.request(app)
      .get(`${url}/${commentId}`)
      .set('Authorization', `Bearer ${authorisedToken}`)
      .end((err, res) => {
        const decoded = jwtDecode(authorisedToken);
        expect(res.status).to.eql(200);
        expect(res.body).to.be.to.a('object');
        expect(decoded.type).to.eql('super-admin');
        expect(res.body).to.have.property('commentHistory');
        done();
      });
  });
  it('should return an error response when a user tries to view comment history', (done) => {
    chai
      .request(app)
      .get(`${url}/${commentId}`)
      .set('Authorization', `Bearer ${unauthorisedUserToken}`)
      .send({ body: 'Stop that' })
      .end((err, res) => {
        const decoded = jwtDecode(unauthorisedUserToken);
        expect(res.status).to.eql(403);
        expect(res.body).to.have.property('errors');
        expect(decoded.type).to.eql('user');
        expect(res.body.errors.message).to.eql('User not authorized');
        done();
      });
  });
});
