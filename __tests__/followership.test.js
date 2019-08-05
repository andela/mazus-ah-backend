import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';

chai.use(chaiHttp);

const url = '/api/v1';
const { expect } = chai;

let validToken;
let userId;
let unvalidToken;


describe('Followership', () => {
  before((done) => {
    const user = {
      email: 'pelumi@test.com',
      password: 'PasswoRD123__',
    };
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        const { token, id } = res.body.user;
        validToken = token;
        userId = id;
        done();
      });
  });

  before((done) => {
    const user = {
      email: 'tunji@test.com',
      password: 'PasswoRD123__',
    };
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        const { token } = res.body.user;
        unvalidToken = token;
        done();
      });
  });

  describe('User Follow Test', () => {
    it('should throw an error if the user does not exist', (done) => {
      chai
        .request(app)
        .post(`${url}/profiles/follow/200d9f5f-0e15-4d52-9490-bf509f2f01db`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(404);
          expect(res.body.errors.message).to.eql('This author does not exist');
          done();
        });
    });
    it('should throw an error if UUID is invalid', (done) => {
      chai
        .request(app)
        .post(`${url}/profiles/follow/200`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body.errors.id).to.eql('id is not valid');
          done();
        });
    });
    it('should allow user successfully follow another user', (done) => {
      chai
        .request(app)
        .post(`${url}/profiles/follow/90356e2a-2f35-48e9-9add-9811c23f2122`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(201);
          expect(res.body.follows.message).to.eql('You followed David Noah');
          done();
        });
    });
    it('should not allow user successfully follow another user twice', (done) => {
      chai
        .request(app)
        .post(`${url}/profiles/follow/90356e2a-2f35-48e9-9add-9811c23f2122`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body.errors.message).to.eql('You already follow David Noah');
          done();
        });
    });
    it('should not allow user follow himself/herself', (done) => {
      chai
        .request(app)
        .post(`${url}/profiles/follow/${userId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body.errors.message).to.eql('You are not allowed to follow yourself');
          done();
        });
    });
    it('should not allow user successfully follow another user if he isn\'t verified', (done) => {
      chai
        .request(app)
        .post(`${url}/profiles/follow/90356e2a-2f35-48e9-9add-9811c23f2122`)
        .set('Authorization', `Bearer ${unvalidToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body.errors.message).to.eql('You are supposed to verify your account to follow your favourite authors');
          done();
        });
    });
  });

  describe('Get User Follower Test', () => {
    it('should throw an error if the user does not exist', (done) => {
      chai
        .request(app)
        .get(`${url}/profiles/followers/200d9f5f-0e15-4d52-9490-bf509f2f01db`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(404);
          expect(res.body.errors.message).to.eql('this author does not exist');
          done();
        });
    });
    it('should throw an error if UUID is invalid', (done) => {
      chai
        .request(app)
        .get(`${url}/profiles/followers/200`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body.errors.id).to.eql('id is not valid');
          done();
        });
    });
    it('should allow user successfully view a particular users followers', (done) => {
      chai
        .request(app)
        .get(`${url}/profiles/followers/90356e2a-2f35-48e9-9add-9811c23f2122`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body.follows.message).to.eql('David Noah has these followers');
          expect(res.body.follows.userFollowers).to.be.a('array');
          done();
        });
    });
  });

  describe('Get User Unfollowing Test', () => {
    it('should throw an error if the user does not exist', (done) => {
      chai
        .request(app)
        .get(`${url}/profiles/followings/200d9f5f-0e15-4d52-9490-bf509f2f01db`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(404);
          expect(res.body.errors.message).to.eql('this author does not exist');
          done();
        });
    });
    it('should throw an error if UUID is invalid', (done) => {
      chai
        .request(app)
        .get(`${url}/profiles/followings/200`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body.errors.id).to.eql('id is not valid');
          done();
        });
    });
    it('should allow user successfully view a particular users followings', (done) => {
      chai
        .request(app)
        .get(`${url}/profiles/followings/90356e2a-2f35-48e9-9add-9811c23f2122`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body.follows.message).to.eql('David Noah is following');
          expect(res.body.follows.userFollowings).to.be.a('array');
          done();
        });
    });
  });

  describe('User Unfollow Test', () => {
    it('should throw an error if the user does not exist', (done) => {
      chai
        .request(app)
        .delete(`${url}/profiles/follow/200d9f5f-0e15-4d52-9490-bf509f2f01db`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(404);
          expect(res.body.errors.message).to.eql('This author does not exist');
          done();
        });
    });
    it('should throw an error if UUID is invalid', (done) => {
      chai
        .request(app)
        .delete(`${url}/profiles/follow/200`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body.errors.id).to.eql('id is not valid');
          done();
        });
    });
    it('should allow user successfully unfollow another user', (done) => {
      chai
        .request(app)
        .delete(`${url}/profiles/follow/90356e2a-2f35-48e9-9add-9811c23f2122`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body.follows.message).to.eql('You have unfollowed David Noah');
          done();
        });
    });
    it('should not allow user successfully unfollow another user twice', (done) => {
      chai
        .request(app)
        .delete(`${url}/profiles/follow/90356e2a-2f35-48e9-9add-9811c23f2122`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body.errors.message).to.eql('You have already unfollowed David Noah');
          done();
        });
    });
    it('should not allow user successfully follow another user if he isn\'t verified', (done) => {
      chai
        .request(app)
        .delete(`${url}/profiles/follow/90356e2a-2f35-48e9-9add-9811c23f2122`)
        .set('Authorization', `Bearer ${unvalidToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body.errors.message).to.eql('You are supposed to verify your account before you can perform this action');
          done();
        });
    });
  });
});
