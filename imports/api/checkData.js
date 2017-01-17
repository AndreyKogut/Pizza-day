import moment from 'moment';

const notEmpty =
  item => !_.isEmpty(item);
const dateIsValid =
  date => moment(date).isValid();
const dateNotPass =
  (date) => {
    if (moment(date).isValid()) {
      const requestDate = new Date(date);
      const currentDate = new Date();

      return requestDate.getTime() > currentDate.getTime();
    }

    return true;
  };

export { notEmpty, dateIsValid, dateNotPass };
