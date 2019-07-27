import swagger from './swagger.json';
import logout from './auth/logout.json';
import signup from './auth/signup.json';

swagger.paths['/auth/signup'] = signup;
swagger.paths['/auth/logout'] = logout;


export default swagger;
