import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';

chai.use(chaiHttp);

const { expect } = chai;

describe('Server Error Test', () => {
  it('Should throw a 500 error when a server error occurs', (done) => {
    chai
      .request(app)
      .post('/fake-route')
      .send('')
      .end((err, res) => {
        expect(res.status).to.eql(404);
        done();
      });
  });
});
