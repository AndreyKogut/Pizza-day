import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }

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
    }, handleMethodsCallbacks(this.googleLoginCallback));
  };

  login(event) {
    event.preventDefault();

    const email = this.email.value.trim();
    const password = this.password.value.trim();

    Meteor.loginWithPassword(
      email,
      password,
      handleMethodsCallbacks(this.passwordLoginCallback),
    );
  }

  render() {
    return (<div>
      <h1>Authorization</h1>
      <form onSubmit={this.login}>
        <button onClick={this.loginWithGoogle} type="button">Google</button>
        <input type="email" ref={(email) => { this.email = email; }} required placeholder="email" />
        <input type="password" ref={(password) => { this.password = password; }} required placeholder="pass" />
        <input type="submit" value="Login" />
      </form>
    </div>);
  }
}

export default Login;
