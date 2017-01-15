import React from 'react';
import { Meteor } from 'meteor/meteor';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import showMessage from '../../helpers/showMessage';

const ForgotPassword = () => {
  function send(event) {
    event.preventDefault();

    const email = this.email.value;

    Meteor.call('user.forgotPasswordResetLink', email, handleMethodsCallbacks(() => {
      showMessage('Reset password link sent');
    }));
  }

  return (<div className="content page-content">
    <div className="mdl-grid main-header">
      <h3 className="m-auto">Forgot password</h3>
    </div>
    <form onSubmit={send} className="mb--30">
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            type="email"
            id="email"
            ref={(email) => { this.email = email; }}
            name="name"
            className="mdl-textfield__input"
            required
          />
          <label
            className="mdl-textfield__label"
            htmlFor="email"
          >User email</label>
        </div>
      </div>
      <div className="mdl-grid">
        <input
          className="m-auto mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
          type="submit"
          value="Send"
        />
      </div>
    </form>
  </div>);
};

export default ForgotPassword;
