import swagger from './swagger.json';
import logout from './auth/logout.json';

swagger.paths['/auth/logout'] = logout;

export default swagger;
