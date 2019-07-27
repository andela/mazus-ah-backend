import swagger from './swagger.json';
import logout from './auth/logout.json';
import signup from './auth/signup.json';
import createProfile from './profile/createAndEditProfile.json';
import viewProfile from './profile/viewProfile.json'

swagger.paths['/auth/signup'] = signup;
swagger.paths['/auth/logout'] = logout;
swagger.paths['/profile'] = createProfile;
swagger.paths['/profile/{id}'] = viewProfile;


export default swagger;
