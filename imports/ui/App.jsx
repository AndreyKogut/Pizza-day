import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";


export class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoggedIn: !!Meteor.userId(),
		};
	}

	hideLogout() {
		this.state.isLoggedIn = false;
	}

	logout() {
		console.log('logout');
		Meteor.logout((err) => {
			if(err) {
				console.log(err);
			} else {
				this.hideLogout();
			}
		});
	}

	getLogoutButton() {
		if(this.state.isLoggedIn) {
			return (
				<button onClick={ this.logout.bind(this) }>Logout</button>
			);
		} else {
			return '';
		}
	}

	render() {
		return (<div>
			I am route :_:. Hello { this.props.email + this.props.name }
			{ this.getLogoutButton() }
		</div>);
	}
}

App.propTypes = {
	email: PropTypes.string,
	name: PropTypes.string,
};

export const AppContainer = createContainer(() => {
	const currentUser = Meteor.user() || {};

	console.log(currentUser);

	let userData = {
		email: '',
		name: '',
	};

	if (currentUser) {
		try {
			userData.name = currentUser.profile.name;
		} catch (e) {
			console.log('Name is empty');
		}

		try {
			userData.email = currentUser.emails[0].address;
		} catch (e) {
			console.log('Email field is empty');
		}

		console.log(userData);
	} else {
		userData.name = 'there';
	}

	return userData;
}, App);