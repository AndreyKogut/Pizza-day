import { check } from 'meteor/check';

function checkDataTypesMethods() {
  const checkIfNotEmpty =
    (string) => {
      check(string, String);

      return string.length > 0;
    };
  const checkIfDateIsValid =
    date => !isNaN((new Date(date)).getTime());
  const checkIfDateNotPass =
    (date) => {
      if (checkIfDateIsValid(date)) {
        const requestDate = new Date(date);
        const currentDate = new Date();

        return requestDate.getTime() > currentDate.getTime();
      }

      return false;
    };
  const checkStringList =
    (list) => {
      for (let i = 0; i < list.length; i += 1) {
        if (!checkIfNotEmpty(list[i])) {
          return false;
        }
      }

      return list.length > 0;
    };

  return {
    checkIfNotEmpty,
    checkIfDateIsValid,
    checkIfDateNotPass,
    checkStringList,
  };
}

export default checkDataTypesMethods();
