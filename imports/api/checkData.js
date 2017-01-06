import { check } from 'meteor/check';

const notEmpty =
  (string) => {
    check(string, String);

    return string.length > 0;
  };
const dateIsValid =
  date => !isNaN((new Date(date)).getTime());
const dateNotPass =
  (date) => {
    if (dateIsValid(date)) {
      const requestDate = new Date(date);
      const currentDate = new Date();

      return requestDate.getTime() > currentDate.getTime();
    }

    return false;
  };
const stringList =
  (list) => {
    for (let i = 0; i < list.length; i += 1) {
      if (!notEmpty(list[i])) {
        return false;
      }
    }

    return list.length > 0;
  };

export { stringList, notEmpty, dateIsValid, dateNotPass };
