import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";
import {Meteor} from 'meteor/meteor';

import {Header} from "../ui/Header";
import {Footer} from "../ui/Footer";

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

			{ <Header id={this.props.id}/> }

			Hello <a href={ FlowRouter.path('/user/:id', {id: Meteor.userId()}) }> { this.props.name }
			( { this.props.email } ) </a> { this.getLogoutButton() }

			{ this.props.content }

			{ <Footer/> }
			<br/>
		</div>);
	}
}

App.propTypes = {
	email: PropTypes.string,
	name: PropTypes.string,
	id: PropTypes.string
};

export const AppContainer = createContainer(() => {

	let {
		_id : id,
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
		id,
		name,
		email
	};
}, App);