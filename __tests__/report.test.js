import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import models from '../database/models';

import app from '../index';

chai.use(chaiHttp);

const url = '/api/v1/articles';
const { expect } = chai;
let validToken;

describe('Testing comment endpoints', () => {
  before((done) => {
    const user = {
      email: 'dd@test.com',
      password: 'PasswoRD123__',
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
  it('should throw a 500 when an error occurs on the server', (done) => {
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
});
