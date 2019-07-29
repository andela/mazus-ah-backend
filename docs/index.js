import swagger from './swagger.json';
import logout from './auth/logout.json';
import signup from './auth/signup.json';
import login from './auth/login.json';

swagger.paths['/auth/signup'] = signup;
swagger.paths['/auth/signin'] = login;
swagger.paths['/auth/logout'] = logout;


export default swagger;
