import swagger from './swagger.json';
import logout from './auth/logout.json';
import signup from './auth/signup.json';
import verifyemail from './auth/verifyemail.json';
import login from './auth/login.json';
import facebookLogin from './auth/facebook.json';
import googleLogin from './auth/google';

swagger.paths['/auth/signup'] = signup;
swagger.paths['/auth/signin'] = login;
swagger.paths['/auth/logout'] = logout;
swagger.paths['/auth/verify'] = verifyemail;
swagger.paths['/auth/facebook'] = facebookLogin;
swagger.paths['/auth/google'] = googleLogin;


export default swagger;
