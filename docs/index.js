import swagger from './swagger.json';
import logout from './auth/logout.json';
import signup from './auth/signup.json';
import verifyemail from './auth/verifyemail.json';

swagger.paths['/auth/signup'] = signup;
swagger.paths['/auth/logout'] = logout;
swagger.paths['/auth/verify'] = verifyemail;


export default swagger;
