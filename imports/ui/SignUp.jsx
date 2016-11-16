import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';


class SignUp extends Component {
	constructor(props) {
		super(props);
	}

	submit(e) {
		e.preventDefault();

		const email = ReactDOM.findDOMNode(this.refs.login).value.trim();
		const password = ReactDOM.findDOMNode(this.refs.password).value.trim();
		const confirmPassword = ReactDOM.findDOMNode(this.refs.confirmPassword).value.trim();

		if (password == confirmPassword) {
			try {
				Meteor.call("insertUser", {
					email,
					password,
				});
			} catch (err) {
				console.log(err);
			} finally {
				Meteor.loginWithPassword(email, password);
			}
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

export const SignUpContainer = createContainer(() => {
	return {}
}, SignUp);