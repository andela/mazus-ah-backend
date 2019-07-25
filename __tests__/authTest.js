import chai from 'chai';
import app from  '../index';

const url = 'api/v1';
let token;

describe('User signup tests', () => {
    describe('test for user signup',  () => {
        it('Should register a user successfully when all fields are inputed correctly', (done) => {
            chai.request(app)
            .post(`${url}/auth/signup`)
            .send(userObject)
            .end((err, res) => {
                token = req.body.user.verificationToken
            }

        })
    })  

}


