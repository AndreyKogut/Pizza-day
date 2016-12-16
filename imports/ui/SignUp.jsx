import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";
import {Meteor} from 'meteor/meteor';

export class SignUp extends Component {
	constructor(props) {
		super(props);
	}

	submit(e) {
		e.preventDefault();

		const email = this.refs.login.value.trim();
		const password = this.refs.password.value.trim();
		const confirmPassword = this.refs.confirmPassword.value.trim();

		if (password == confirmPassword) {

			Meteor.call("insertUser", {
				email,
				password
			}, (err) => {
				if(err) {
					throw new Error(err);
				} else {
					Meteor.loginWithPassword(email, password);
				}
			});

		} else {
			console.log('Passwords not equal!');
		}

		return false;
	}

	render() {
		return (<div>
			<h1>Registration</h1>
			<form onSubmit={ this.submit.bind(this) }>
				<input type="email" ref="login" name="login" placeholder="email"/>
				<input type="password" ref="password" name="password" placeholder="pass"/>
				<input type="password" ref="confirmPassword" name="confirmPassword" placeholder="confirm pass"/>
				<input type="submit" value={'Join us'}/>
			</form>
		</div>);
	}
}

SignUp.propTypes = {};