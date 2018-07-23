import {Log4js,Logger,Configuration,configure} from 'log4js';

const config : Configuration = {
	appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
	categories: { default: { appenders: ['cheese'], level: 'error' } }
};

export const log4js: Log4js = configure(config);

