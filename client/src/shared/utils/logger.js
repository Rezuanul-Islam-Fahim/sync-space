import { isDev } from '../config/env';

/* eslint-disable no-console */
const logger = {
  log: (...args) => {
    if (isDev) console.log(...args);
  },
  warn: (...args) => {
    if (isDev) console.warn(...args);
  },
  error: (...args) => {
    console.error(...args);
  },
};

export default logger;
