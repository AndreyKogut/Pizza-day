import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.signUp = this.signUp.bind(this);
  }

  signUpCallback = (email, password) => {
    Meteor.loginWithPassword(email, password);
  };

  signUp(event) {
    event.preventDefault();

    const email = this.email.value.trim();
    const password = this.password.value.trim();
    const confirmPassword = this.confirmPassword.value.trim();

    if (password === confirmPassword) {
      Meteor.call('user.insert', {
        email,
        password,
      }, handleMethodsCallbacks(this.signUpCallback.bind(null, email, password)));
    } else {
      // TODO: Inform user that passwords not equal
    }
  }

  render() {
    return (<div>
      <h1>Registration</h1>
      <form onSubmit={this.signUp}>
        <input
          type="email"
          ref={(email) => { this.email = email; }}
          name="login"
          placeholder="email"
        />
        <input
          type="password"
          ref={(password) => { this.password = password; }}
          name="password"
          placeholder="Password"
        />
        <input
          type="password"
          ref={(confirm) => { this.confirmPassword = confirm; }}
          name="confirmPassword"
          placeholder="Confirm password"
        />
        <input type="submit" value={'Join us'} />
      </form>
    </div>);
  }
}

export default SignUp;
