import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import models from '../database/models';

import app from '../index';

chai.use(chaiHttp);

const url = '/api/v1/articles';
const baseUrl = '/api/v1/admin';
const { expect } = chai;
let validToken;

describe('Testing Reports endpoints', () => {
  before((done) => {
    const user = {
      email: 'jamal.sabri@mail.com',
      password: 'P455w0rd',
    };
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        const { token } = res.body.user;
        validToken = token;
        done();
      });
  });
  it('should get an empty array if no reports yet', (done) => {
    chai.request(app)
      .get(`${baseUrl}/reportedarticles`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('reportedArticles');
        expect(res.body.reportedArticles).to.be.a('array');
        expect(res.body.reportedArticles.length).to.eql(0);
        done();
      });
  });
  it('should not post a report with no title', (done) => {
    chai
      .request(app)
      .post(`${url}/some-slug/report`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ reportTitle: '', reportBody: 'body' })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.reportTitle).to.eql('A title is required');
        done();
      });
  });
  it('should not post a report with no body', (done) => {
    chai
      .request(app)
      .post(`${url}/some-slug/report`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ reportTitle: 'title', reportBody: '' })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.reportBody).to.eql('A body is required');
        done();
      });
  });
  it('should successfully report an article', (done) => {
    chai
      .request(app)
      .post(`${url}/some-slug/report`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ reportTitle: 'title', reportBody: 'some complain' })
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body).to.have.property('report');
        expect(res.body.report).to.be.a('object');
        expect(res.body.report).to.have.property('reportTitle');
        expect(res.body.report).to.have.property('reportBody');
        expect(res.body.report.reportTitle).to.eql('title');
        expect(res.body.report.reportBody).to.eql('some complain');
        done();
      });
  });
  it('should throw a 500 on server error while creating a report', (done) => {
    const stub = sinon
      .stub(models.Article, 'findOne')
      .rejects(new Error('Server error occured'));
    chai
      .request(app)
      .post(`${url}/some-slug/report`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ reportTitle: 'title', reportBody: 'some message' })
      .end((err, res) => {
        expect(res.status).to.eql(500);
        stub.restore();
        done();
      });
  });

  it('should get all reported articles', (done) => {
    chai.request(app)
      .get(`${baseUrl}/reportedarticles`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('reportedArticles');
        expect(res.body.reportedArticles).to.be.a('array');
        expect(res.body.reportedArticles[0].slug).to.eql('some-slug');
        expect(res.body.reportedArticles[0].title).to.eql('Some title');
        expect(res.body.reportedArticles[0].body).to.eql('the body the article goes here');
        expect(res.body.reportedArticles[0].reports).to.eql(1);
        done();
      });
  });
  it('should throw a 500 on server error while getting reported articles', (done) => {
    const stub = sinon
      .stub(models.Article, 'findAll')
      .rejects(new Error('Server error occured'));
    chai
      .request(app)
      .get(`${baseUrl}/reportedarticles`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        stub.restore();
        done();
      });
  });
});
