import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";

export class UserCabinet extends Component {
	constructor(props) {
		super(props);
	}

	getProfileFields() {
		const { emails, profile: userProfile } = Meteor.user();

		return (<div>
			<ul>
				<li>Name : { userProfile.name }</li>
				<li>Email : { emails[0].address }</li>
			</ul>
		</div>);
	}

	render() {
		return (<div>
			Hello { this.props.id }

			<br/>

			<h3>Profile data</h3>

			{ this.getProfileFields() }
		</div>);
	}
}

UserCabinet.propTypes = {
	id: PropTypes.string,
};
