import React from 'react';
import { Meteor } from 'meteor/meteor';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import showMessage from '../../helpers/showMessage';

const SignUp = () => {
  function signUpCallback({ email, password }) {
    Meteor.loginWithPassword(email, password);
  }

  function signUp(event) {
    event.preventDefault();

    const email = this.email.value.trim();
    const password = this.password.value.trim();
    const confirmPassword = this.confirmPassword.value.trim();
    const position = this.position.value.trim();
    const company = this.company.value.trim();
    const about = this.about.value.trim();
    const name = this.userName.value.trim();

    if (password === confirmPassword) {
      Meteor.call('user.insert', {
        email,
        password,
        name,
        position,
        company,
        about,
      }, handleMethodsCallbacks(signUpCallback));
    } else {
      showMessage('Password and confirm password not equal');
    }
  }

  return (<div className="content page-content">
    <div className="mdl-grid main-header">
      <h3 className="m-auto">Join us</h3>
    </div>
    <form onSubmit={signUp} className="mb--30">
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            type="text"
            id="user-name"
            ref={(userName) => { this.userName = userName; }}
            name="name"
            className="mdl-textfield__input"
            required
          />
          <label
            className="mdl-textfield__label"
            htmlFor="user-name"
          >Name</label>
        </div>
      </div>
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            type="email"
            id="email"
            ref={(email) => { this.email = email; }}
            name="login"
            className="mdl-textfield__input"
            required
          />
          <label
            className="mdl-textfield__label"
            htmlFor="email"
          >Email</label>
        </div>
      </div>
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            type="password"
            id="pass"
            ref={(password) => { this.password = password; }}
            name="password"
            className="mdl-textfield__input"
            required
          />
          <label
            className="mdl-textfield__label"
            htmlFor="pass"
          >Pass</label>
        </div>
      </div>
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            type="password"
            id="pass-2"
            ref={(confirm) => { this.confirmPassword = confirm; }}
            name="confirmPassword"
            className="mdl-textfield__input"
            required
          />
          <label
            className="mdl-textfield__label"
            htmlFor="pass-2"
          >Confirm pass</label>
        </div>
      </div>
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <textarea
            id="about"
            ref={(about) => { this.about = about; }}
            name="about"
            className="mdl-textfield__input"
          />
          <label
            className="mdl-textfield__label"
            htmlFor="about"
          >About</label>
        </div>
      </div>
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            type="text"
            id="company"
            ref={(company) => { this.company = company; }}
            name="company"
            className="mdl-textfield__input"
          />
          <label
            className="mdl-textfield__label"
            htmlFor="company"
          >Company name</label>
        </div>
      </div>
      <div className="mdl-grid">
        <div className="m-auto mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            type="text"
            id="position"
            ref={(position) => { this.position = position; }}
            name="position"
            className="mdl-textfield__input"
          />
          <label
            className="mdl-textfield__label"
            htmlFor="position"
          >Position</label>
        </div>
      </div>
      <div className="mdl-grid">
        <input
          className="m-auto mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
          type="submit"
          value="Join"
        />
      </div>
    </form>
  </div>);
};

export default SignUp;
