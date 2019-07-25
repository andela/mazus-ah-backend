import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '..';
import models from '../database/models';

chai.use(chaiHttp);

const API_PREFIX = '/api/v1/auth';
const { expect } = chai;
const { BlacklistedToken } = models;
let validUserToken;
const blacklistedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiSm9obiIsImlhdCI6MTU2NDAwOTA5NCwiZXhwIjoxNTY0MDEyNjk0fQ.J5ktoXlmLxOtV8R16sNPMXXeydwRdCA8h6Cep-AzZnc';

describe('Auth Routes Test', () => {
  before((done) => {
    const user = {
      firstName: 'Darth',
      lastName: 'Vader',
      email: 'darthsss@vader.com',
      password: 'password12'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
      .send(user)
      .end((err, res) => {
        const { token } = res.body.user;
        validUserToken = token;
        done();
      });
  });

  it('Should throw 401 status code accessing the logout route without a token', (done) => {
    chai
      .request(app)
      .post(`${API_PREFIX}/logout`)
      .end((err, res) => {
        expect(res.status).to.eql(401);
        done();
      });
  });

  it('Should not let a logged out user make a request', (done) => {
    chai
      .request(app)
      .post(`${API_PREFIX}/logout`)
      .set('Authorization', `Bearer ${blacklistedToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body)
          .to.have.property('errors')
          .to.be.a('object');
        done();
      });
  });

  it('Should not let a user with an invalid token make a request', (done) => {
    chai
      .request(app)
      .post(`${API_PREFIX}/logout`)
      .set('Authorization', '')
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body)
          .to.have.property('errors')
          .to.be.a('object');
        expect(res.body).to.have.nested.property('errors.message');
        done();
      });
  });

  it('Should log out a user', (done) => {
    chai
      .request(app)
      .post(`${API_PREFIX}/logout`)
      .set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body)
          .to.have.property('data')
          .to.be.a('object');
        done();
      });
  });

  it('Should throw a 500 status code when an error occurs on the server', (done) => {
    const stub = sinon.stub(BlacklistedToken, 'create').rejects(new Error('Foreign Key constraint'));
    chai
      .request(app)
      .post(`${API_PREFIX}/logout`)
      .set('Authorization', `${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        stub.restore();
        done();
      });
  });
});
