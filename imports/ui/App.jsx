import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";


export class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoggedIn: !!Meteor.userId(),
		};
	}

	logout() {
		console.log('logout');
		Meteor.logout((err) => {
			if (err) {
				console.log(err);
			} else {
				this.setState({
					state: {
						isLoggedIn: false,
					}
				});
			}
		});
	}

	getLogoutButton() {
		if (this.state.isLoggedIn) {
			return (
				<button onClick={ this.logout.bind(this) }>Logout</button>
			);
		} else {
			return '';
		}
	}

	render() {
		return (<div>
			I am route :_:. Hello { this.props.name + "(" + this.props.email + ")" }
			{ this.getLogoutButton() }
			<br/>
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
		if (currentUser.profile) {
			userData.name = currentUser.profile.name;
		} else {
			userData.name = 'No name';
		}

		userData.email = currentUser.emails ? currentUser.emails[0].address : 'No emails';

		console.log(userData);
	}
	else {
		userData.name = 'there';
	}

	return userData;
}, App);