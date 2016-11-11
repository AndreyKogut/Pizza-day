import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';


export class Login extends Component {
	constructor(props) {
		super(props);
	}

	loginWithGoogle() {

		Meteor.loginWithGoogle({
			requestPermissions: ['email', 'profile']
		}, (err) => {
			if (err) {
				console.log(err);
			} else {
				console.log('Ez');
			}
		});

	}

	submit(e) {
		e.preventDefault();

		const email = ReactDOM.findDOMNode(this.refs.login).value.trim();
		const password = ReactDOM.findDOMNode(this.refs.password).value.trim();

		Meteor.loginWithPassword(email, password, function (err) {
			if(!err) {
				console.log(Meteor.user());
			}
		});

		return false;
	}

	render() {
		return (<div>
			<form onSubmit={ this.submit.bind(this) }>
				<button onClick={ this.loginWithGoogle.bind(this) }>Google</button>
				<input type="text" ref="login" name="login"/>
				<input type="password" ref="password" name="password"/>
				<input type="submit" value={'submit'}/>
			</form>
		</div>);
	}
}

Login.propTypes = {};

export const LoginContainer = createContainer(() => {
	return {}
}, Login);