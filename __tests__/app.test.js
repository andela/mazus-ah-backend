import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

const { expect } = chai;

describe('Server Error Test', () => {
  it('Should return a welcome message', done => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.message).to.eql('Welcome to Author\'s Haven');
        done();
      });
  });
});
