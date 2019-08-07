import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

const url = '/api/v1/users';
const { expect } = chai;
let validToken;

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
        validToken = token;
        done();
      });
  });
  it('should get all articles successfully', (done) => {
    chai
      .request(app)
      .get(url)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.users).to.have.property('message');
        expect(res.body.users.message).to.eql('Users fetched successfully');
        expect(res.body.users).to.be.a('object');
        done();
      });
  });
});
