import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../.';
import User from '../models/User';

chai.use(chaiHttp);

const { expect } = chai;

describe('Server Error Test', () => {
  it('Should throw a 500 error when a server error occurs', done => {
    const stub = sinon
      .stub(User, 'findById')
      .rejects(new Error('Some Error occured'));
    chai
      .request(app)
      .get('/api/user')
      .end((err, res) => {
        expect(res.status).to.eql(500);
        stub.restore();
        done();
      });
  });
});
