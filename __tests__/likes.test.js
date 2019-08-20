import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import models from '../database/models';

import app from '../index';

chai.use(chaiHttp);

const url = '/api/v1/articles';
const { expect } = chai;
let validToken;

describe('Testing /like & /dislike endpoints', () => {
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

  it('should successfully like an article', (done) => {
    chai
      .request(app)
      .post(`${url}/building-apis-with-nodejs-48458493/like`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.have.property('message');
        expect(res.body.article.message).to.eql("You just liked 'Building APIs with Nodejs'");
        done();
      });
  });
  it('should successfully remove a like from an article', (done) => {
    chai
      .request(app)
      .post(`${url}/building-apis-with-nodejs-48458493/like`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.have.property('message');
        expect(res.body.article.message).to.eql("Your like on 'Building APIs with Nodejs' has been removed");
        done();
      });
  });
  it('should successfully dislike an article', (done) => {
    chai
      .request(app)
      .post(`${url}/building-apis-with-nodejs-48458493/dislike`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(201); expect(res.body).to.have.property('article');
        expect(res.body.article).to.have.property('message');
        expect(res.body.article.message).to.eql("You just disliked 'Building APIs with Nodejs'");
        done();
      });
  });
  it('should successfully change the dislike of an article to like ', (done) => {
    chai
      .request(app)
      .post(`${url}/building-apis-with-nodejs-48458493/like`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.have.property('message');
        expect(res.body.article.message).to.eql("You just liked 'Building APIs with Nodejs'");
        done();
      });
  });
  it('should successfully change the like of an article to dislike', (done) => {
    chai
      .request(app)
      .post(`${url}/building-apis-with-nodejs-48458493/dislike`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.have.property('message');
        expect(res.body.article.message).to.eql("You just disliked 'Building APIs with Nodejs'");
        done();
      });
  });

  it('should successfully dislike an article', (done) => {
    chai
      .request(app)
      .post(`${url}/some-slug/dislike`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.have.property('message');
        expect(res.body.article.message).to.eql("You just disliked 'Some title'");
        done();
      });
  });
  it('should successfully remove a disliked article', (done) => {
    chai
      .request(app)
      .post(`${url}/some-slug/dislike`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.have.property('message');
        expect(res.body.article.message).to.eql("Your dislike on 'Some title' has been removed");
        done();
      });
  });
  it('should throw a 500 when an error occurs on the server', (done) => {
    const stub = sinon
      .stub(models.Like, 'findOne')
      .rejects(new Error('Server error occured'));
    chai
      .request(app)
      .post(`${url}/some-slug/like`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        stub.restore();
        done();
      });
  });
  it('should throw a 500 when an error occurs on the server', (done) => {
    const stub = sinon
      .stub(models.Like, 'findOne')
      .rejects(new Error('Server error occured'));
    chai
      .request(app)
      .post(`${url}/some-slug/dislike`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        stub.restore();
        done();
      });
  });
});
