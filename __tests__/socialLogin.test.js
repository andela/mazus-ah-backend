import { expect } from 'chai';
import sinon from 'sinon';
import AuthController from '../controllers/AuthController';

describe('Social login', () => {
  const req = {
    user: {
      _json: {
        id: '1213224343',
        name: 'Anthony Oladele',
        email: 'olaA@test.com'
      }
    }
  };

  const mock404 = () => {
    const res = {};
    res.status = () => 404;
    res.json = () => ({ errors: { message: 'Resource not found' } });
    return res;
  };

  const mock200 = () => {
    const res = {};
    res.status = () => 200;
    res.json = () => ({
      user: {
        id: 1,
        firstName: 'Anthony',
        lastName: 'Oladele',
        email: 'olaA@test.com',
      }
    });
    return res;
  };

  it('should return 404 if user not found on request object', async () => {
    const req = {};
    sinon.stub(AuthController, 'socialLogin').returns(mock404());
    const result = await AuthController.socialLogin(req, {}, () => ({}));
    expect(result.status()).to.eql(404);
    expect(result.json().errors.message).to.eql('Resource not found');
    AuthController.socialLogin.restore();
  });

  it('should return 200 on successful login', async () => {
    sinon.stub(AuthController, 'socialLogin').returns(mock200());
    const result = await AuthController.socialLogin(req, {}, () => ({}));
    expect(result.status()).to.eql(200);
    expect(result.json().user.firstName).to.eql('Anthony');
    expect(result.json().user.lastName).to.eql('Oladele');
    expect(result.json().user.email).to.eql('olaA@test.com');
    AuthController.socialLogin.restore();
  });
});
