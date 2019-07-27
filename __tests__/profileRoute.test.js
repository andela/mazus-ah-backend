import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import mockProfile from './mock/mockProfile';

chai.use(chaiHttp);

const url = '/api/v1/profile';
const { expect } = chai;
let validToken;

describe('Profile test', () => {
  before((done) => {
    const user = {
      firstName: 'Luis',
      lastName: 'Gucci',
      email: 'luicGucci@outfit.com',
      password: 'passWORD122',
    };
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        const { token } = res.body.user;
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
        .send(mockProfile.unsupportedProfile)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors[0]).to.eql('Avatar is not a valid URL, please input a valid URL');
          expect(res.body.errors[1]).to.eql('Bio is not a valid string, please input a valid string');
          done();
        });
    });

    it('should create a profile successfully when all field are inputed correctly', (done) => {
      chai
        .request(app)
        .post(`${url}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(mockProfile.correctProfile)
        .end((err, res) => {
          expect(res.status).to.eql(201);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.eql('Your profile has been created successfully');
          expect(res.body.profile).to.have.property('name');
          expect(res.body.profile).to.have.property('bio');
          expect(res.body.profile).to.have.property('avatar');
          expect(res.body.profile.avatar).to.eql(mockProfile.correctProfile.avatar);
          expect(res.body.profile.bio).to.eql(mockProfile.correctProfile.bio);
          done();
        });
    });

    it('should not create a profile if profile has already been created', (done) => {
      chai
        .request(app)
        .post(`${url}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(mockProfile.correctProfile)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body).to.have.property('errors');
          expect(res.body).to.have.nested.property('errors');
          done();
        });
    });
  });

  describe('Edit profile', () => {
    it('should throw error if input is unsupported', (done) => {
      chai
        .request(app)
        .patch(url)
        .set('Authorization', `Bearer ${validToken}`)
        .send(mockProfile.unsupportedProfilEdit)
        .end((err, res) => {
          expect(res.status).to.eql(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors[0]).to.eql('Avatar is not a valid URL, please input a valid URL');
          expect(res.body.errors[1]).to.eql('Bio is not a valid string, please input a valid string');
          expect(res.body.errors[2]).to.eql('FirstName is not a valid String, please input a valid string');
          expect(res.body.errors[3]).to.eql('LastName is not a valid string, please input a valid string');
          done();
        });
    });

    it('should successfully update the profile if all input are correct', (done) => {
      chai
        .request(app)
        .patch(url)
        .set('Authorization', `Bearer ${validToken}`)
        .send(mockProfile.correctProfilEdit)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.eql('Your profile has been updated successfully');
          expect(res.body.profile).to.have.property('avatar');
          expect(res.body.profile).to.have.property('bio');
          expect(res.body.profile).to.have.property('firstName');
          expect(res.body.profile).to.have.property('lastName');
          expect(res.body.profile.avatar).to.eql(mockProfile.correctProfilEdit.avatar);
          expect(res.body.profile.bio).to.eql(mockProfile.correctProfilEdit.bio);
          expect(res.body.profile.firstName).to.eql(mockProfile.correctProfilEdit.firstName);
          expect(res.body.profile.lastName).to.eql(mockProfile.correctProfilEdit.lastName);
          done();
        });
    });
  });

  describe('View profile', () => {
    it('should return error if id does not exist in database', (done) => {
      chai
        .request(app)
        .get(`${url}/3000`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors[0]).to.eql('No User with the specified ID was found');
          done();
        });
    });

    it('should fetch profile successfully', (done) => {
      chai
        .request(app)
        .get(`${url}/1`)
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.eql('Profile fetched successfully');
          expect(res.body.profile).to.have.property('id');
          expect(res.body.profile).to.have.property('email');
          expect(res.body.profile).to.have.property('firstName');
          expect(res.body.profile).to.have.property('lastName');
          expect(res.body.profile).to.have.property('verificationToken');
          expect(res.body.profile).to.have.property('isVerified');
          expect(res.body.profile).to.have.property('type');
          done();
        });
    });
  });
});
