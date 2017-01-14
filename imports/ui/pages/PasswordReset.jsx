import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import showMessage from '../../helpers/showMessage';

const propTypes = {
  token: PropTypes.string,
};

const PasswordReset = ({ token }) => {
  function onChangeCallback() {
    showMessage('Password updated');
    FlowRouter.go('/login');
  }

  function reset(event) {
    event.preventDefault();

    const password = this.password.value;

    Accounts.resetPassword(
      token,
      password,
      handleMethodsCallbacks(onChangeCallback),
    );
  }

  return (<div className="content page-content">
    <div className="mdl-grid main-header">
      <h3 className="m-auto">Reset password</h3>
    </div>
    <form onSubmit={reset} className="mb--30">
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            type="password"
            id="pass"
            ref={(pass) => { this.password = pass; }}
            name="name"
            className="mdl-textfield__input"
            required
          />
          <label
            className="mdl-textfield__label"
            htmlFor="pass"
          >New password</label>
        </div>
      </div>
      <div className="mdl-grid">
        <input
          className="m-auto mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
          type="submit"
          value="Change"
        />
      </div>
    </form>
  </div>);
};

PasswordReset.propTypes = propTypes;

export default PasswordReset;
