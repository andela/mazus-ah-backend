import swagger from './swagger.json';
import logout from './auth/logout.json';
import signup from './auth/signup.json';
import login from './auth/login.json';
import facebookLogin from './auth/facebook.json';
import googleLogin from './auth/google';
import createProfile from './profile/createProfile.json';
import viewAndEditProfile from './profile/viewAndEditProfile.json';
import verifyemail from './auth/verifyemail';
import forgotpassword from './auth/forgotpassword.json';
import resetpassword from './auth/resetpassword.json';

swagger.paths['/auth/signup'] = signup;
swagger.paths['/auth/signin'] = login;
swagger.paths['/auth/logout'] = logout;
swagger.paths['/auth/facebook'] = facebookLogin;
swagger.paths['/auth/google'] = googleLogin;
swagger.paths['/profiles'] = createProfile;
swagger.paths['/profiles/{id}'] = viewAndEditProfile;
swagger.paths['/verify'] = verifyemail;
swagger.paths['/auth/forgotpassword'] = forgotpassword;
swagger.paths['/auth/resetpassword/{token}'] = resetpassword;


export default swagger;
