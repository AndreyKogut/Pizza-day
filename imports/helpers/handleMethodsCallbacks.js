import showMessage from './showMessage';

function handleMethodsCallbacks(handledFunction = () => {}) {
  return (err, res) => {
    if (err) {
      let errorText = '';

      if ((new Meteor.Error(err)).message === '[Error: FS.Collection insert: file does not pass collection filters]') {
        errorText = 'Invalid image';
      } else {
        switch (err.error) {
          case 400: {
            errorText = err.reason;
            break;
          }
          case 403: {
            switch (err.reason) {
              case 'error.accounts.Login forbidden' : {
                errorText = 'No such email and password combination';
                break;
              }
              case 'Email already exists' : {
                errorText = 'Email already exist';
                break;
              }
              case 'Not owner': {
                errorText = 'You should be owner';
                break;
              }
              case 'Not member': {
                errorText = 'You should be participant';
                break;
              }
              case 'Unauthorized': {
                errorText = 'Unauthorized';
                break;
              }
              default: {
                errorText = 'Access denied';
              }
            }
            break;
          }
          case 500: {
            errorText = 'Server not available';
            break;
          }
          case 503: {
            errorText = 'Server not available';
            break;
          }
          default: {
            errorText = 'Unresolved problem';
          }
        }
      }

      showMessage(errorText);
    } else {
      handledFunction(res);
    }
  };
}

export default handleMethodsCallbacks;
