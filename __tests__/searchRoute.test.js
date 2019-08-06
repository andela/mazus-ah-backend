import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';

chai.use(chaiHttp);

const { expect } = chai;
const searchUrl = '/api/v1/search';

describe('Custom search', () => {
  it('returns a 400 response when user sends an empty keyword', (done) => {
    chai
      .request(app)
      .get(searchUrl)
      .query({ keyword: '' })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.errors).to.eql('Please input a search parameter');
        done();
      });
  });
  it("returns a 404 response when user sends a keyword that can't be matched", (done) => {
    chai
      .request(app)
      .get(searchUrl)
      .query({ keyword: 'xo**' })
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body.errors.message).to.eql('No Match was found for your request!');
        done();
      });
  });
  it('returns matching results from the articles table for a correct article title input', (done) => {
    const keyword = '3 bad guys';
    chai
      .request(app)
      .get(searchUrl)
      .query({ keyword })
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.keys('matches found');
        expect(res.body['matches found'].keyword).to.be.eql(keyword);
        expect(res.body['matches found'].articles).to.be.an('array');
        expect(res.body['matches found'].articles.length).to.be.greaterThan(0);
        done();
      });
  });
  it('returns matching results from the authors table for a correct article title input', (done) => {
    const keyword = 'John';
    chai
      .request(app)
      .get(searchUrl)
      .query({ keyword })
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.keys('matches found');
        expect(res.body['matches found'].keyword).to.be.eql(keyword);
        expect(res.body['matches found'].authors).to.be.an('array');
        expect(res.body['matches found'].authors.length).to.be.greaterThan(0);
        done();
      });
  });
});
