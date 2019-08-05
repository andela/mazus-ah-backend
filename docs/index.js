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
import viewArticleRating from './rating/rating.json';
import article from './articles/articles.json';
import articlesBySlug from './articles/articlesBySlug.json';
import articlesByAuthor from './articles/articlesByAuthor.json';
import userArticles from './users/userArticles.json';
import updateAndDeleteArticles from './articles/updateAndDeleteArticle.json';
import postComment from './articles/postComment.json';
import followAndUnfollowUser from './profile/followAndUnfollowUser.json';
import userFollowers from './profile/userFollowers.json';
import userFollowings from './profile/userFollowings.json';
import likeArticle from './articles/likeArticle.json';
import dislikeArticle from './articles/dislikeArticle';

swagger.paths['/auth/signup'] = signup;
swagger.paths['/auth/signin'] = login;
swagger.paths['/auth/logout'] = logout;
swagger.paths['/auth/facebook'] = facebookLogin;
swagger.paths['/auth/google'] = googleLogin;
swagger.paths['/profiles'] = createProfile;
swagger.paths['/profiles/{id}'] = viewAndEditProfile;
swagger.paths['/auth/verify'] = verifyemail;
swagger.paths['/auth/forgotpassword'] = forgotpassword;
swagger.paths['/auth/resetpassword/{token}'] = resetpassword;
swagger.paths['/articles/{id}/ratings'] = viewArticleRating;
swagger.paths['/articles'] = article;
swagger.paths['/articles/{id}/{slug}'] = articlesBySlug;
swagger.paths['/articles/{id}'] = articlesByAuthor;
swagger.paths['/articles/{slug}'] = updateAndDeleteArticles;
swagger.paths['/users/articles'] = userArticles;
swagger.paths['/profiles/follow/{id}'] = followAndUnfollowUser;
swagger.paths['/profiles/followers/{id}'] = userFollowers;
swagger.paths['/profiles/followings/{id}'] = userFollowings;


swagger.paths['/articles/{slug}/comments'] = postComment;
swagger.paths['/articles/{slug}/like'] = likeArticle;
swagger.paths['/articles/{slug}/dislike'] = dislikeArticle;


export default swagger;
