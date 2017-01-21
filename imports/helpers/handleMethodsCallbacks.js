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
              case 'No participants': {
                errorText = 'Event has 0 orders';
                break;
              }
              case 'Invalid email': {
                errorText = 'Such email does not exist';
                break;
              }
              case 'User not found': {
                errorText = 'Such user not found';
                break;
              }
              case 'Token expired': {
                errorText = 'Verification link expired';
                break;
              }
              case 'Unverified': {
                errorText = 'You can\'t edit any data without email verification';
                break;
              }
              case 'Event ordered': {
                errorText = 'Event already ordered';
                break;
              }
              case 'All emails verified': {
                errorText = 'You have no unverified emails';
                break;
              }
              case 'Verify email link expired' : {
                errorText = 'Verify link expired';
                break;
              }
              case 'error.accounts.Login forbidden' : {
                errorText = 'No such email and password combination';
                break;
              }
              case 'Email already exists.' : {
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
