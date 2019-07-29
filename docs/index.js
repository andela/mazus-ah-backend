import swagger from './swagger.json';
import logout from './auth/logout.json';
import signup from './auth/signup.json';
import forgotpassword from './auth/forgotpassword.json';
import resetpassword from './auth/resetpassword.json';

swagger.paths['/auth/signup'] = signup;
swagger.paths['/auth/logout'] = logout;
swagger.paths['/auth/forgotpassword'] = forgotpassword;
swagger.paths['/auth/resetpassword/{token}'] = resetpassword;

export default swagger;
