import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';
import seededUsers from './mockData/seededUsers';
import mockArticles from './mockData/mockArticles';
import seededArticles from './mockData/seededArticles';

chai.use(chaiHttp);

const API_PREFIX = '/api/v1/articles';
const { expect } = chai;
let validUserToken;
let notArticleOwnerToken;
let unverifiedUserToken;
let articleSlug;
let userId;
const fakeUserId = 'f6b3facb-eb83-47f8-8c1c-05207e62ed30';

describe('Article Routes Test', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(seededUsers[0])
      .end((err, res) => {
        const { token, id } = res.body.user;
        userId = id;
        validUserToken = token;
      });

    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(seededUsers[2])
      .end((err, res) => {
        const { token, id } = res.body.user;
        userId = id;
        notArticleOwnerToken = token;
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

  it('should successfully edit an article', (done) => {
    chai.request(app)
      .patch(`${API_PREFIX}/${seededArticles[0].slug}`).set('Authorization', `Bearer ${validUserToken}`).send({
        title: 'A New Story',
        body: 'Some new article body',
        description: 'An article to showcase editing',
        status: 'published'
      })
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.be.a('object');
        expect(res.body.article).to.have.property('title').eql('A New Story');
        expect(res.body.article).to.have.property('description').eql('An article to showcase editing');
        done();
      });
  });

  it('should not edit an article if the user does not own the article', (done) => {
    chai.request(app)
      .patch(`${API_PREFIX}/${seededArticles[0].slug}`)
      .set('Authorization', `Bearer ${notArticleOwnerToken}`).send({
        title: 'An Attempted Modification gone wrong',
        body: 'There will be an attempt to modify this article, but it won\'t work',
        description: 'An article to showcase editing'
      })
      .end((err, res) => {
        expect(res.status).to.be.eql(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.to.a('object');
        expect(res.body.errors).to.have.property('article').eql('Article not found');
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
      .get(`${API_PREFIX}/${userId}/${articleSlug}`)
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
      .get(`${API_PREFIX}/${fakeUserId}/${articleSlug}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.to.a('object');
        expect(res.body.errors).to.have.property('article').eql('Author not found');
        done();
      });
  });

  it('should return an error when trying to get articles for an author with an invalid id', (done) => {
    chai.request(app)
      .get(`${API_PREFIX}/sillyId/${articleSlug}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.to.a('object');
        expect(res.body.errors).to.have.property('id').eql('id is not valid');
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

  it('should not delete an article if the user does not own the article', (done) => {
    chai.request(app)
      .delete(`${API_PREFIX}/${seededArticles[0].slug}`)
      .set('Authorization', `Bearer ${notArticleOwnerToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.to.a('object');
        expect(res.body.errors).to.have.property('article').eql('Article not found');
        done();
      });
  });

  it('should send a published article to the trash can when it\'s deleted', (done) => {
    chai.request(app)
      .delete(`${API_PREFIX}/${seededArticles[0].slug}`)
      .set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.be.to.a('object');
        expect(res.body.article).to.have.property('message');
        expect(res.body.article.message).to.eql('Article has been moved to your trash');
        done();
      });
  });

  it('should delete an article permanently, when it\'s already in the drafts', (done) => {
    chai.request(app)
      .delete(`${API_PREFIX}/${seededArticles[0].slug}`)
      .set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.be.to.a('object');
        expect(res.body.article).to.have.property('message');
        expect(res.body.article.message).to.eql('Article has been deleted');
        done();
      });
  });

  it('should return trending articles when the endpoint is hit', (done) => {
    chai.request(app)
      .get(`${API_PREFIX}/trends`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('trends');
        expect(res.body.trends).to.be.to.a('array');
        done();
      });
  });
});
