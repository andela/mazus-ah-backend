import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';
import models from '../database/models';
import mockRates from './mockData/mockRates';
import seededUsers from './mockData/seededUsers';


chai.use(chaiHttp);

const { Rating } = models;

const url = '/api/v1/articles';
const rateUrl = '/api/v1/articles/some-slug/ratings';
const authorUrl = '/api/v1/articles/3-bad-guys/ratings';
const wrongUrl = '/api/v1/articles/3-bad/ratings';
const loginUrl = '/api/v1/auth/signin';

const { expect } = chai;

let validToken, verifiedUserToken, unverifiedUserToken;
const slug = '3-bad-guys';


describe('Check ratings', () => {
  before((done) => {
    const user = {
      firstName: 'Arya',
      lastName: 'Stark',
      email: 'aryastark@mail.com',
      password: 'pasusWORD122',
      confirmPassword: 'pasusWORD122',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        const { token } = res.body.user;
        validToken = token;
      });
    chai
      .request(app)
      .post(loginUrl)
      .send(seededUsers[0])
      .end((err, res) => {
        const { token } = res.body.user;
        verifiedUserToken = token;
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
  it('should show the list of those that rated an article', (done) => {
    chai
      .request(app)
      .get(`${url}/${slug}/ratings`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.article[0]).to.have.property('rate');
        expect(res.body.article[0]).to.have.property('userdetails');
        expect(res.body.article[0].userdetails).to.have.property('firstName');
        expect(res.body.article[0].userdetails).to.have.property('lastName');
        expect(res.body.article[0].userdetails).to.have.property('profile');
        done();
      });
  });
  it('should return an error if id does not exist', (done) => {
    chai
      .request(app)
      .get(`${url}/200/ratings`)
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.message).to.eql('Resource not found');
        done();
      });
  });

  describe('Create Rating', () => {
    it('should throw a 500 when an error occurs on the server', (done) => {
      const stub = sinon.stub(Rating, 'create').rejects(new Error('Foreign Key constraint'));
      chai
        .request(app)
        .post(rateUrl)
        .set('Authorization', `Bearer ${verifiedUserToken}`)
        .send(mockRates[0])
        .end((err, res) => {
          expect(res.status).to.eql(500);
          stub.restore();
          done();
        });
    });

    it('should create a rating successfully', (done) => {
      chai
        .request(app)
        .post(`${rateUrl}`)
        .set('Authorization', `Bearer ${verifiedUserToken}`)
        .send(mockRates[0])
        .end((err, res) => {
          expect(res.status).to.equal(201);
          const { article } = res.body;
          expect(article.message).to.be.eql('Your rating has been added successfully');
          expect(article).to.have.property('articleId');
          expect(article).to.have.property('rate');
          expect(article).to.have.property('firstName');
          expect(article).to.have.property('lastName');
          expect(article.rate).to.eql(mockRates[0].rate);
          done();
        });
    });
    it('should throw error when author tries to rate his article', (done) => {
      chai
        .request(app)
        .post(authorUrl)
        .set('Authorization', `Bearer ${verifiedUserToken}`)
        .send(mockRates[1])
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.message).to.be.eql("You can't rate your article");
          done();
        });
    });
    it('should update rating when author tries to rate an article again', (done) => {
      chai
        .request(app)
        .post(`${rateUrl}`)
        .set('Authorization', `Bearer ${verifiedUserToken}`)
        .send(mockRates[2])
        .end((err, res) => {
          const { article } = res.body;
          expect(res.status).to.equal(201);
          expect(article.message).to.be.eql('Your rating has been added successfully');
          expect(article).to.have.property('articleId');
          expect(article).to.have.property('rate');
          expect(article.rate).to.eql(mockRates[2].rate);
          done();
        });
    });
    it('should throw error when user tries to rate article that does not exist', (done) => {
      chai
        .request(app)
        .post(`${wrongUrl}`)
        .set('Authorization', `Bearer ${verifiedUserToken}`)
        .send(mockRates[2])
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.errors.message).to.be.eql('Article with that slug does not exist');
          done();
        });
    });
    it('should throw error when user tries to enter an invalid rate value', (done) => {
      chai
        .request(app)
        .post(rateUrl)
        .set('Authorization', `Bearer ${verifiedUserToken}`)
        .send(mockRates[3])
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.rate).to.be.eql('The rate value you entered is not valid, rate should be between 1 and 5');
          done();
        });
    });
    it('should throw error when unverified user tries to rate article that exist', (done) => {
      chai
        .request(app)
        .post(`${url}`)
        .set('Authorization', `Bearer ${unverifiedUserToken}`)
        .send(mockRates[2])
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.errors.message).to.be.eql('Your account has not been verified, please verify to continue');
          done();
        });
    });
  });
});
