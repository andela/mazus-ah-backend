import '@babel/polyfill';
import express from 'express';
import cors from 'cors';
import errorhandler from 'errorhandler';
import logger from 'morgan';
import Debug from 'debug';
import swaggerUi from 'swagger-ui-express';

import docs from './docs';
import routes from './routes';
import ServerResponse from './modules';

const debug = Debug('dev');
const isProduction = process.env.NODE_ENV === 'production';
const { notFoundError, developmentServerErrorResponse, serverErrorResponse } = ServerResponse;
const API_PREFIX = '/api/v1';

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(docs));

app.use(express.static(`${__dirname}/public`));
app.use(API_PREFIX, routes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Author\'s Haven' });
});

if (!isProduction) {
  app.use(errorhandler());
}

// catch 404 and forward to error handler
app.use(notFoundError);

// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(developmentServerErrorResponse);
}

// production error handler
// no stacktraces leaked to user
app.use(serverErrorResponse);

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  debug(`Listening on port ${server.address().port}`);
});

export default app;