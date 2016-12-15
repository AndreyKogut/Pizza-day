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
			I am route :_:. Hello <a href={ FlowRouter.path('/user/:id', {id: Meteor.userId()}) }> { this.props.name }
			( { this.props.email } ) </a>
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

	let {
		emails : [
			{
				address: email = 'No emails'
			} = {}
		] = [],
		profile : {
			name = 'No name',
		} = {}
	} = Meteor.user() || {};

	return {
		name,
		email
	};
}, App);