import { createClientApplication } from './app';
import logger from 'loglevel';

createClientApplication()
  .then(() => {
    logger.info('Application started.');
  })
  .catch((error) => {
    logger.error('Unable to start application', error);
  });
