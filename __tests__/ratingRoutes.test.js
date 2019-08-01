import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '..';

chai.use(chaiHttp);

const url = '/api/v1/articles';
const { expect } = chai;

let validToken;
const slug = '3-bad-guys';


describe('Check ratings', () => {
  before((done) => {
    const user = {
      firstName: 'Arya',
      lastName: 'Stark',
      email: 'aryastark@mail.com',
      password: 'pasusWORD122',
      confirmPassword: 'pasusWORD122',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        const { token } = res.body.user;
        validToken = token;

        done();
      });
  });
  it('should show the list of those that rated an article', (done) => {
    chai
      .request(app)
      .get(`${url}/${slug}/ratings`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.data[0]).to.have.property('rate');
        expect(res.body.data[0]).to.have.property('userdetails');
        expect(res.body.data[0].userdetails).to.have.property('firstName');
        expect(res.body.data[0].userdetails).to.have.property('lastName');
        done();
      });
  });
  it('should return an error if id does not exist', (done) => {
    chai
      .request(app)
      .get(`${url}/200/ratings`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.message).to.eql('Resource not found');
        done();
      });
  });
});
