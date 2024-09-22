import { Router } from 'express';
import logger from '../utils/logger.js';

const router = Router();

router.get('/loggerTest', (req, res) => {
    logger.debug('Debug message');
    logger.http('HTTP log message');
    logger.info('Info message');
    logger.warning('Warning message');
    logger.error('Error message');
    logger.fatal('Fatal error message');

    res.send('Logs have been recorded');
});

export default router;