import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';

chai.use(chaiHttp);

const { expect } = chai;
const searchUrl = '/api/v1/search';

describe('Custom search', () => {
  it('returns a 400 response when user sends an empty keyword', (done) => {
    const keyword = '';
    chai
      .request(app)
      .get(searchUrl)
      .query({ keyword })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body.errors.message).to.eql('Please input a search parameter');
        done();
      });
  });
  it("returns a 200 response and an object of empty arrays when a keyword that can't be matched is inputed", (done) => {
    chai
      .request(app)
      .get(searchUrl)
      .query({ keyword: '*x*' })
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.matches.articles).to.eql([]);
        expect(res.body.matches.tags).to.eql([]);
        expect(res.body.matches.authors).to.eql([]);
        done();
      });
  });
  it('returns matching results from the articles table for a correct article title input', (done) => {
    const keyword = '3 bad guys';
    const customFilter = 'title';
    chai
      .request(app)
      .get(searchUrl)
      .query({ keyword, customFilter })
      .end((err, res) => {
        const { matches } = res.body;
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.keys('matches');
        expect(matches.articles).to.be.a('array');
        expect(res.body.matches.articles.length).to.be.greaterThan(0);
        expect(matches.articles[0].title).to.eql('3 Bad Guys');
        done();
      });
  });
  it('returns matching results from the authors table for a correct author input', (done) => {
    const keyword = 'John';
    const customFilter = 'author';
    chai
      .request(app)
      .get(searchUrl)
      .query({ keyword, customFilter })
      .end((err, res) => {
        const { matches } = res.body;
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.keys('matches');
        expect(matches.authors).to.be.a('array');
        expect(matches.authors[0].firstName || matches.authors[0].lastName).to.include('John');
        expect(res.body.matches.authors.length).to.be.greaterThan(0);
        done();
      });
  });
  it('returns matching results from the tags table for a correct tag input', (done) => {
    const keyword = 'Nodejs';
    const customFilter = 'tag';
    chai
      .request(app)
      .get(searchUrl)
      .query({ keyword, customFilter })
      .end((err, res) => {
        const { matches } = res.body;
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.keys('matches');
        expect(matches.tags).to.be.a('array');
        expect(matches.tags[0].tagsList[0]).to.eql('Nodejs');
        expect(matches.tags[0].title).to.eql('Building APIs with Nodejs');
        done();
      });
  });
});
