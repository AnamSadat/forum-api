import { expressjwt as jwt } from 'express-jwt';
import config from '../../../Commons/config.js';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';

const jwtMiddleware = jwt({
  secret: config.auth.accessTokenKey,
  algorithms: ['HS256'],
  credentialsRequired: true,
  requestProperty: 'user',
});

const authenticateToken = (req, res, next) => {
  jwtMiddleware(req, res, (err) => {
    if (err) {
      return next(new AuthenticationError('Missing authentication'));
    }
    next();
  });
};

export default authenticateToken;
