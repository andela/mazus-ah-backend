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
const fakeUserId = 'f6b3facb-eb83-47f8-8c1c-05207e62ed30';
const blacklistedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiSm9obiIsImlhdCI6MTU2NDAwOTA5NCwiZXhwIjoxNTY0MDEyNjk0fQ.J5ktoXlmLxOtV8R16sNPMXXeydwRdCA8h6Cep-AzZnc';

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
      .send(seededUsers[2])
      .end((err, res) => {
        const { token } = res.body.user;
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
        expect(res.status).to.be.eql(401);
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
      .get(`${API_PREFIX}/${articleSlug}`)
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

  it('should get an article by the slug', (done) => {
    chai.request(app)
      .get(`${API_PREFIX}/3-bad-guys`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.be.a('object');
        expect(res.body.article).to.have.property('title').eql('3 Bad Guys');
        expect(res.body.article).to.have.property('slug').eql('3-bad-guys');
        expect(res.body.article).to.have.property('tagsList').eql(null);
        expect(res.body.article.articlecomment).to.be.a('array');
        expect(res.body.article.articlecomment[0]).to.have.property('highlightedText').to.eql(null);
        expect(res.body.article.articlecomment[0]).to.have.property('containsHighlightedText').to.eql(false);
        done();
      });
  });

  it('should return an error when trying to get articles for an author that doesn\'t exist', (done) => {
    chai.request(app)
      .get(`${API_PREFIX}/author/${fakeUserId}`)
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
      .get(`${API_PREFIX}/author/sillyId`)
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
        expect(res.body.articles.allArticles).to.be.a('array');
        expect(res.body.articles.allArticles.length).to.eql(1);
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

  it('should delete an article', (done) => {
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

  it('should not bookmark if article id does not exist', (done) => {
    chai.request(app)
      .post(`${API_PREFIX}/cf67650f-5b74-416e-9050-89f92f147ecb/bookmark`)
      .set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.a('object');
        expect(res.body.errors).to.have.property('bookmark');
        expect(res.body.errors.bookmark).to.eql('Something went wrong, unable to bookmark article');
        done();
      });
  });
  it('should not bookmark if user is not logged in', (done) => {
    chai.request(app)
      .post(`${API_PREFIX}/${seededArticles[1].id}/bookmark`)
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.a('object');
        expect(res.body.errors).to.have.property('message');
        expect(res.body.errors.message).to.eql('No token provided');
        done();
      });
  });
  it('should successfully boomark an article', (done) => {
    chai.request(app)
      .post(`${API_PREFIX}/${seededArticles[1].id}/bookmark`)
      .set('Authorization', `Bearer ${validUserToken}`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body.bookmark).to.have.property('message');
        expect(res.body.bookmark.message).to.eql('Article has been removed from bookmarked successfully');
        done();
      });
  });

  it('should return trending articles when the endpoint is hit', (done) => {
    chai.request(app)
      .get(`${API_PREFIX}/trends`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('trends');
        expect(res.body.trends).to.be.to.a('object');
        expect(res.body.trends).to.have.property('articles');
        expect(res.body.trends).to.have.property('articleCount');
        expect(res.body.trends.articles).to.be.to.a('array');
        expect(res.body.trends.articleCount).to.be.to.a('number');
        expect(res.body.trends.articleCount).to.be.eql(10);
        done();
      });
  });

  it('should return trending articles by a tag when the endpoint is hit', (done) => {
    chai.request(app)
      .get(`${API_PREFIX}/trends?tag=mobile`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('trends');
        expect(res.body.trends).to.be.to.a('object');
        expect(res.body.trends).to.have.property('articles');
        expect(res.body.trends).to.have.property('articleCount');
        expect(res.body.trends.articles).to.be.to.a('array');
        expect(res.body.trends.articleCount).to.be.to.a('number');
        done();
      });
  });

  it('should return an error response when a blacklisted token is provided', (done) => {
    chai.request(app)
      .get(`${API_PREFIX}/${articleSlug}`)
      .set('Authorization', `Bearer ${blacklistedToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('Invalid token provided, please sign in');
        done();
      });
  });
  it('should return an error response when an invalid token is provided', (done) => {
    chai.request(app)
      .get(`${API_PREFIX}/${articleSlug}`)
      .set('Authorization', `Bearer ${validUserToken}s`)
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body.errors.message).to.eql('Invalid token provided');
        done();
      });
  });
  it('should get all tags', (done) => {
    chai.request(app)
      .get(`${API_PREFIX}/tags`)
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('tags');
        expect(res.body.tags).to.be.to.a('array');
        expect(res.body.tags[0]).to.eql('Nodejs');
        expect(res.body.tags[1]).to.eql('car');
        expect(res.body.tags[2]).to.eql('mobile');
        done();
      });
  });
});
