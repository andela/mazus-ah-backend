import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';
import seededUsers from './mockData/seededUsers';
import mockArticles from './mockData/mockArticles';

chai.use(chaiHttp);

const API_PREFIX = '/api/v1/articles';
const { expect } = chai;
let validUserToken;
let unverifiedUserToken;
let articleSlug;

describe('Article Routes Test', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(seededUsers[0])
      .end((err, res) => {
        const { token } = res.body.user;
        validUserToken = token;
      });

    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(seededUsers[1])
      .end((err, res) => {
        const { token } = res.body.user;
        unverifiedUserToken = token;
        done();
      });
  });

  it('should not allow an unverified user to create an article', (done) => {
    chai.request(app)
      .post(`${API_PREFIX}`).send(mockArticles[3]).set('Authorization', `Bearer ${unverifiedUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(401);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.to.a('object');
        expect(res.body.errors).to.have.property('message').eql('Your account has not been verified, please verify to continue');
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
        expect(res.body.errors).to.have.property('tags').eql('Only a maximum of 10 tags are allowed');
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

  it('should successfully create an article without a draft status', (done) => {
    chai.request(app)
      .post(`${API_PREFIX}`).send(mockArticles[5]).set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        const { slug } = res.body.article;
        articleSlug = slug;
        expect(res.status).to.be.eql(201);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.be.to.a('object');
        expect(res.body.article).to.have.property('title').eql(mockArticles[5].title);
        expect(res.body.article).to.have.property('body').eql(mockArticles[5].body);
        expect(res.body.article).to.have.property('description').eql(mockArticles[5].description);
        expect(res.body.article).to.have.property('tagsList').eql(mockArticles[5].tags);
        done();
      });
  });

  it('should get an article by the slug', (done) => {
    chai.request(app)
      .get(`${API_PREFIX}/${seededUsers[0].email}/${articleSlug}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.be.to.a('object');
        expect(res.body.article).to.have.property('title').eql(mockArticles[5].title);
        expect(res.body.article).to.have.property('slug').eql(articleSlug);
        expect(res.body.article).to.have.property('tagsList').eql(mockArticles[5].tags);
        done();
      });
  });

  it('should return an error when trying to get articles for an author that doesn\'t exist', (done) => {
    chai.request(app)
      .get(`${API_PREFIX}/notreal@user.com/${articleSlug}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.to.a('object');
        expect(res.body.errors).to.have.property('article').eql('Author not found');
        done();
      });
  });

  it('should get articles by tags', (done) => {
    chai.request(app)
      .get(`${API_PREFIX}?tag=sports`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('articles');
        expect(res.body.articles).to.be.to.a('array');
        expect(res.body.articles.length).to.eql(1);
        done();
      });
  });

  it('should get all articles belonging to a user including the drafts', (done) => {
    chai.request(app)
      .get('/api/v1/users/articles')
      .set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('articles');
        expect(res.body.articles).to.be.to.a('array');
        expect(res.body.articles.length).to.eql(5);
        done();
      });
  });
});
