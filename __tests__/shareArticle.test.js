import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '..';
import models from '../database/models';
import seededUsers from './mockData/seededUsers';

chai.use(chaiHttp);

const { expect } = chai;
let validUserToken;
const articleSlug = '3-bad-guys';
const url = `/api/v1/articles/${articleSlug}/share`;

describe('Share an article', () => {
  const recipientEmail = { email: 'sendmail@mail.com' };
  before((done) => {
    chai
      .request(app)
      .post('/api/v1//auth/signin')
      .send(seededUsers[2])
      .end((err, res) => {
        const { token } = res.body.user;
        validUserToken = token;
        done();
      });
  });
  it('should share an article using the email', (done) => {
    chai.request(app)
      .get(`${url}/mail`)
      .send(recipientEmail)
      .set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.be.to.a('object');
        expect(res.body.article).to.have.property('message');
        done();
      });
  });
  it('should share an article using the Twitter', (done) => {
    chai.request(app)
      .get(`${url}/twitter`)
      .send(recipientEmail)
      .set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        done();
      });
  });
  it('should return a 404 if the article is not found', (done) => {
    chai.request(app)
      .get('/api/v1/articles/notfound/share/mail')
      .send(recipientEmail)
      .set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.to.a('object');
        expect(res.body.errors).to.have.property('article').eql('Article not found');
        done();
      });
  });
  it('should throw a 500 when an error occurs on the server', (done) => {
    const stub = sinon
      .stub(models.Article, 'findAll')
      .rejects(new Error('Server error occured'));
    chai
      .request(app)
      .get(`${url}/mail`)
      .set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        stub.restore();
        done();
      });
  });
});
