import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import mockProfile from './mockData/mockProfile';

chai.use(chaiHttp);

const url = '/api/v1/profiles';
const { expect } = chai;
const {
  correctProfilEdit,
  correctProfile,
  unsupportedProfilEdit,
  unsupportedProfile
} = mockProfile;
let validToken;
let userId;

describe('Profile test', () => {
  before((done) => {
    const user = {
      firstName: 'Luis',
      lastName: 'Gucci',
      email: 'luicGucci@outfit.com',
      password: 'passWORD122',
      confirmPassword: 'passWORD122',
    };
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        const { token } = res.body.user;
        const { id } = res.body.user;
        userId = id;
        validToken = token;
        done();
      });
  });
  describe('Create profile', () => {
    it('should not create a profile if unsupported input format is provided', (done) => {
      chai
        .request(app)
        .post(`${url}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(unsupportedProfile)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.avatar).to.eql('Avatar is not a valid URL, please input a valid URL');
          expect(res.body.errors.bio).to.eql('Bio is not a valid string, please input a valid string');
          done();
        });
    });

    it('should create a profile successfully when all field are inputed correctly', (done) => {
      chai
        .request(app)
        .post(`${url}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(correctProfile)
        .end((err, res) => {
          expect(res.status).to.eql(201);
          expect(res.body.data).to.have.property('message');
          expect(res.body.data.message).to.eql('Your profile has been created successfully');
          expect(res.body.data.profile).to.have.property('name');
          expect(res.body.data.profile).to.have.property('bio');
          expect(res.body.data.profile).to.have.property('avatar');
          expect(res.body.data.profile.avatar).to.eql(correctProfile.avatar);
          expect(res.body.data.profile.bio).to.eql(correctProfile.bio);
          done();
        });
    });

    it('should not create a profile if profile has already been created', (done) => {
      chai
        .request(app)
        .post(`${url}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(correctProfile)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body).to.have.property('errors');
          expect(res.body).to.have.nested.property('errors');
          expect(res.body.errors).to.eql('Profile already exists');
          done();
        });
    });
  });

  describe('Edit profile', () => {
    it('should throw error if input is unsupported', (done) => {
      chai
        .request(app)
        .patch(`${url}/${userId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(unsupportedProfilEdit)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.avatar).to.eql('Avatar is not a valid URL, please input a valid URL');
          expect(res.body.errors.bio).to.eql('Bio is not a valid string, please input a valid string');
          expect(res.body.errors.firstName).to.eql('FirstName is not a valid String, please input a valid string');
          expect(res.body.errors.lastName).to.eql('LastName is not a valid string, please input a valid string');
          done();
        });
    });

    it('should successfully update the profile if all input are correct', (done) => {
      chai
        .request(app)
        .patch(`${url}/${userId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(correctProfilEdit)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data.message).to.eql('Your profile has been updated successfully');
          expect(res.body.data.profile).to.have.property('avatar');
          expect(res.body.data.profile).to.have.property('bio');
          expect(res.body.data.profile).to.have.property('firstName');
          expect(res.body.data.profile).to.have.property('lastName');
          expect(res.body.data.profile.avatar).to.eql(correctProfilEdit.avatar);
          expect(res.body.data.profile.bio).to.eql(correctProfilEdit.bio);
          expect(res.body.data.profile.firstName).to.eql(correctProfilEdit.firstName);
          expect(res.body.data.profile.lastName).to.eql(correctProfilEdit.lastName);
          done();
        });
    });
  });

  describe('View profile', () => {
    it('should return error if id does not exist in database', (done) => {
      chai
        .request(app)
        .get(`${url}/200d9f5f-0e15-4d52-9490-bf509f2f01db`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.id).to.eql('No User with the specified ID was found');
          done();
        });
    });

    it('should return error if id is not a valid integer', (done) => {
      chai
        .request(app)
        .get(`${url}/333`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors.id).to.eql('id is not valid');
          done();
        });
    });

    it('should fetch profile successfully', (done) => {
      chai
        .request(app)
        .get(`${url}/${userId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.eql('Profile fetched successfully');
          expect(res.body.profile).to.have.property('id');
          expect(res.body.profile).to.have.property('userId');
          expect(res.body.profile).to.have.property('bio');
          expect(res.body.profile).to.have.property('avatar');
          expect(res.body.profile.avatar).to.eql(correctProfilEdit.avatar);
          expect(res.body.profile.bio).to.eql(correctProfilEdit.bio);
          expect(res.body.profile.userId).to.eql(userId);
          done();
        });
    });
  });
});
