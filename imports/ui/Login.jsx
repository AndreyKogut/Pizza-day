import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }

  handleMethodsCallbacks =
    handledFunction =>
      (err) => {
        if (err) {
          switch (err.error) {
            case 500: {
              console.log('Service unavailable');
              break;
            }
            case 403: {
              console.log('No such password/login combination');
              break;
            }
            case 400: {
              console.log('No ...');
              break;
            }
            default: {
              console.log('Something going wrong');
            }
          }
        }

        if (handledFunction) handledFunction();
      };

  // Callbacks in progress

  googleLoginCallback = () => {
    console.log('loggined with google plus');
  };

  passwordLoginCallback = () => {
    console.log('logined with pass');
  };

  loginWithGoogle = (event) => {
    event.preventDefault();

    Meteor.loginWithGoogle({
      requestPermissions: ['email', 'profile'],
      loginStyle: 'popup',
    }, this.handleMethodsCallbacks(this.googleLoginCallback));
  };

  login(event) {
    event.preventDefault();

    const email = this.email.value.trim();
    const password = this.password.value.trim();

    Meteor.loginWithPassword(
      email,
      password,
      this.handleMethodsCallbacks(this.passwordLoginCallback),
    );
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
