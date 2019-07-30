import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';
import mockUsers from './mockData/mockUsers';
import mockArticles from './mockData/mockArticles';

chai.use(chaiHttp);

const API_PREFIX = '/api/v1/articles';
const { expect } = chai;
let validUserToken;

describe('Article Routes Test', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(mockUsers[9])
      .end((err, res) => {
        const { token } = res.body.user;
        validUserToken = token;
        done();
      });
  });

  it('should throw an error when the title of an article is missing', (done) => {
    chai.request(app)
      .post(`${API_PREFIX}`).send(mockArticles[1]).set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.to.a('object');
        expect(res.body.errors).to.have.property('title').eql('Title cannot be empty');
        done();
      });
  });

  it('should throw an error when the tags of an article more than the allowed amount', (done) => {
    chai.request(app)
      .post(`${API_PREFIX}`).send(mockArticles[2]).set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.to.a('object');
        expect(res.body.errors).to.have.property('tags').eql('Only a maximum of 3 tags are allowed');
        done();
      });
  });

  it('should throw an error when the tags of an article are not formatted properly', (done) => {
    chai.request(app)
      .post(`${API_PREFIX}`).send(mockArticles[3]).set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.to.a('object');
        expect(res.body.errors).to.have.property('tags').eql('Tags must be grouped in an array');
        done();
      });
  });

  it('should not allow a non-signed in user create an article', (done) => {
    chai.request(app)
      .post(`${API_PREFIX}`).send(mockArticles[3]).set('Authorization', 'Bearer faketokenvaluehere')
      .end((err, res) => {
        expect(res.status).to.be.eql(403);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.to.a('object');
        expect(res.body.errors).to.have.property('message').eql('Invalid token provided');
        done();
      });
  });

  it('should successfully create an article', (done) => {
    chai.request(app)
      .post(`${API_PREFIX}`).send(mockArticles[0]).set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(201);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.be.to.a('object');
        expect(res.body.article).to.have.property('title').eql(mockArticles[0].title);
        expect(res.body.article).to.have.property('body').eql(mockArticles[0].body);
        expect(res.body.article).to.have.property('description').eql(mockArticles[0].description);
        expect(res.body.article).to.have.property('tagsList').eql(mockArticles[0].tags);
        done();
      });
  });

  it('should successfully create an article without tags', (done) => {
    chai.request(app)
      .post(`${API_PREFIX}`).send(mockArticles[4]).set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(201);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.be.to.a('object');
        expect(res.body.article).to.have.property('title').eql(mockArticles[4].title);
        expect(res.body.article).to.have.property('body').eql(mockArticles[4].body);
        expect(res.body.article).to.have.property('description').eql(mockArticles[4].description);
        expect(res.body.article).to.have.property('tagsList').eql([]);
        done();
      });
  });
});
