import moment from 'moment';
import { Match } from 'meteor/check';

const notEmpty = () =>
  Match.Where(value => !_.isEmpty(value));
const dateIsValid = () =>
  Match.Where(value => moment(value).isValid());
const dateNotPass = () =>
  Match.Where(value => moment(new Date()).isBefore(value));

export { notEmpty, dateIsValid, dateNotPass };
