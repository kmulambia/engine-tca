import moment from 'moment';
import * as SERVICE from '../services.config.json';
import logger from './logger.service';
const zmq = require("zeromq");
const socket = zmq.socket("push");

var MailerConfig = SERVICE.MAILER;
//mailer
socket.bind(MailerConfig.URL, (error: any) => {
  if (error) {
    logger.log({
      level: 'error',
      type: 'service_error',
      message: logger.log('error', MailerConfig.NAME, {message: JSON.stringify({error: true, message: 'FAILED-TO-CONNECT', metadata: error.message, time: moment().format('DD/MM/YYYY hh:mm:ss')})})
    });
  }
});

Object.freeze(socket);
export default socket;
