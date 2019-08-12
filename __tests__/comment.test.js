import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import models from '../database/models';

import app from '../index';

chai.use(chaiHttp);

const url = '/api/v1/articles';
const likesUrl = '/api/v1/comments/likes';
const { expect } = chai;
let validToken;
let commentId;
let commentLikerToken;

describe('Testing comment endpoints', () => {
  before((done) => {
    const user = {
      email: 'dd@test.com',
      password: 'PasswoRD123__',
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

  before((done) => {
    const likerUser = {
      email: 'johndoe@test.com',
      password: 'passwordHash',
    };
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(likerUser)
      .end((err, res) => {
        const { token } = res.body.user;
        commentLikerToken = token;
        done();
      });
  });

  it('should not post a comment on an article that doesnt exist', (done) => {
    chai
      .request(app)
      .post(`${url}/slug-of-some-article-that-doesnt-exit-in-db/comments`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ body: 'sample comment body' })
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.have.property('article');
        expect(res.body.errors.article).to.eql('That article does not exist');
        done();
      });
  });
  it('should not post a comment on an article that is not yet published', (done) => {
    chai
      .request(app)
      .post(`${url}/draft-article-slug/comments`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ body: 'sample comment body' })
      .end((err, res) => {
        expect(res.status).to.eql(405);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.eql('cannot comment on a draft article');
        done();
      });
  });
  it('should not post a comment with no message in body', (done) => {
    chai
      .request(app)
      .post(`${url}/some-slug/comments`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ body: '' })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.body).to.eql('comment body is required');
        done();
      });
  });
  it('should post a comment successfully', (done) => {
    chai
      .request(app)
      .post(`${url}/some-slug/comments`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ body: 'I think technology is the new oil' })
      .end((err, res) => {
        const { id } = res.body.comment;
        commentId = id;
        expect(res.status).to.eql(201);
        expect(res.body).to.have.property('comment');
        expect(res.body.comment.body).to.eql('I think technology is the new oil');
        expect(res.body.comment).to.have.property('id');
        expect(res.body.comment).to.have.property('userId');
        expect(res.body.comment).to.have.property('articleId');
        expect(res.body.comment).to.have.property('articleSlug');
        done();
      });
  });

  it('should post a comment with a highlighted text successfully', (done) => {
    chai
      .request(app)
      .post(`${url}/some-slug/comments`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ body: 'I think technology is the new oil', highlightedText: 'Technology is change the landscape of Africa' })
      .end((err, res) => {
        const { id } = res.body.comment;
        commentId = id;
        expect(res.status).to.eql(201);
        expect(res.body).to.have.property('comment');
        expect(res.body.comment.body).to.eql('I think technology is the new oil');
        expect(res.body.comment).to.have.property('id');
        expect(res.body.comment).to.have.property('userId');
        expect(res.body.comment).to.have.property('articleId');
        expect(res.body.comment).to.have.property('articleSlug').eql('some-slug');
        expect(res.body.comment).to.have.property('highlightedText').eql('Technology is change the landscape of Africa');
        expect(res.body.comment).to.have.property('containsHighlightedText').eql(true);
        done();
      });
  });

  it('should throw a 500 when an error occurs on the server', (done) => {
    const stub = sinon
      .stub(models.Comment, 'create')
      .rejects(new Error('Server error occured'));
    chai
      .request(app)
      .post(`${url}/some-slug/comments`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ body: 'some comment being posted' })
      .end((err, res) => {
        expect(res.status).to.eql(500);
        stub.restore();
        done();
      });
  });

  it('should let a user like a comment', (done) => {
    chai
      .request(app).post(`${likesUrl}/${commentId}`)
      .set('Authorization', `Bearer ${commentLikerToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body).to.have.property('comment');
        expect(res.body.comment).to.have.property('message');
        expect(res.body.comment.message).to.eql('Comment liked');
        expect(res.body.comment).to.have.property('like');
        expect(res.body.comment.like).to.have.property('id');
        expect(res.body.comment.like).to.have.property('commentId').to.eql(commentId);
        done();
      });
  });

  it('should not like an article that does not exist', (done) => {
    chai
      .request(app)
      .post(`${likesUrl}/ffe25dbe-29ea-4759-8461-ed116f6739dd`)
      .set('Authorization', `Bearer ${commentLikerToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.a('object');
        expect(res.body.errors).to.have.property('comment').eql('That comment does not exist');
        done();
      });
  });

  it('should remove a like from a comment', (done) => {
    chai
      .request(app).post(`${likesUrl}/${commentId}`)
      .set('Authorization', `Bearer ${commentLikerToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('comment');
        expect(res.body.comment).to.have.property('message');
        expect(res.body.comment.message).to.eql('\'Like\' has been removed');
        done();
      });
  });
});
