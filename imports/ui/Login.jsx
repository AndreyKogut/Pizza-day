import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }

  loginWithGoogle = () => {
    Meteor.loginWithGoogle({
      requestPermissions: ['email', 'profile'],
      loginStyle: 'popup',
    }, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  };

  login(event) {
    event.preventDefault();
    const email = this.email.value.trim();
    const password = this.password.value.trim();

    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        throw new Error(err);
      }
    });

    return false;
  }

  render() {
    return (<div>
      <h1>Authorization</h1>
      <form onSubmit={this.login}>
        <button onClick={this.loginWithGoogle}>Google</button>
        <input type="email" ref={(email) => { this.email = email; }} required placeholder="email" />
        <input type="password" ref={(password) => { this.password = password; }} required placeholder="pass" />
        <input type="submit" value="Login" />
      </form>
    </div>);
  }
}

export default Login;
