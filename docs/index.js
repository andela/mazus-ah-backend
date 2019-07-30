import swagger from './swagger.json';
import logout from './auth/logout.json';
import signup from './auth/signup.json';
import verifyemail from './auth/verifyemail.json';
import login from './auth/login.json';
import facebookLogin from './auth/facebook.json';
import googleLogin from './auth/google';
import createProfile from './profile/createProfile.json';
import viewAndEditProfile from './profile/viewAndEditProfile.json';

swagger.paths['/auth/signup'] = signup;
swagger.paths['/auth/signin'] = login;
swagger.paths['/auth/logout'] = logout;
swagger.paths['/auth/verify'] = verifyemail;
swagger.paths['/auth/facebook'] = facebookLogin;
swagger.paths['/auth/google'] = googleLogin;
swagger.paths['/profiles'] = createProfile;
swagger.paths['/profiles/{id}'] = viewAndEditProfile;


export default swagger;
