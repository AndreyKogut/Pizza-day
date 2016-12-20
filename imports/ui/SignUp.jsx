import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.signUp = this.signUp.bind(this);
  }

  signUp(event) {
    event.preventDefault();
    const email = this.email.value.trim();
    const password = this.password.password.value.trim();
    const confirmPassword = this.confirmPassword.value.trim();

    if (password === confirmPassword) {
      Meteor.call('user.insert', {
        email,
        password,
      }, (err) => {
        if (err) {
          throw new Error(err);
        } else {
          Meteor.loginWithPassword(email, password);
        }
      });
    } else {
      // Inform user that passwords not equal
    }

    return false;
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
          placeholder="pass"
        />
        <input
          type="password"
          ref={(confirm) => { this.confirmPassword = confirm; }}
          name="confirmPassword"
          placeholder="confirm pass"
        />
        <input type="submit" value={'Join us'} />
      </form>
    </div>);
  }
}

export default SignUp;
