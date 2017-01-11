import React from 'react';
import { Meteor } from 'meteor/meteor';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';

const Login = () => {
  function loginWithGoogle() {
    Meteor.loginWithGoogle({
      requestPermissions: ['email', 'profile'],
      loginStyle: 'popup',
    }, handleMethodsCallbacks);
  }
  function login(event) {
    event.preventDefault();

    const email = this.email.value.trim();
    const password = this.password.value.trim();

    Meteor.loginWithPassword(
      email,
      password,
      handleMethodsCallbacks,
    );
  }

  return (<div className="content page-content">
    <div className="mdl-grid main-header">
      <h3 className="m-auto">Authorization</h3>
    </div>
    <form onSubmit={login} className="mb--30">
      <div className="mdl-grid">
        <button
          onClick={loginWithGoogle}
          className="m-auto mdl-button mdl-js-button mdl-button--colored"
          type="button"
        >
          Login with google
        </button>
      </div>
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            type="email"
            id="email"
            className="mdl-textfield__input"
            ref={(email) => { this.email = email; }}
            required
          />
          <label
            className="mdl-textfield__label"
            htmlFor="email"
          >Email...</label>
        </div>
      </div>
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            type="password"
            id="pass"
            className="mdl-textfield__input"
            ref={(password) => { this.password = password; }}
            required
          />
          <label
            className="mdl-textfield__label"
            htmlFor="pass"
          >Password...</label>
        </div>
      </div>
      <div className="mdl-grid">
        <input
          className="m-auto mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
          type="submit"
          value="Login"
        />
      </div>
    </form>
  </div>);
};

export default Login;
