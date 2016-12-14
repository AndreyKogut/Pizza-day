import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";
import {Images} from "../configs/imageConfig";

export class UserCabinet extends Component {
	constructor(props) {
		super(props);
	}

	loadFile(event) {
		event.preventDefault();

		const file = this.refs.image.files[0];

		Images.insert(file, (err, fileObj) => {
			if (err) {
				throw new Error(err.reason);
			} else {
				Meteor.call('updateUser', {_id: Meteor.userId(), avatar: `/cfs/files/avatars/${fileObj._id}`});
			}
		});

		return false;
	}

	getProfileFields() {
		const {emails, profile: userProfile} = Meteor.user();

		return (<div>
			<ul>
				<li><img src={ userProfile.avatar || ""} alt=""/></li>
				<li>Name : { userProfile.name }</li>
				<li>Email : { emails[0].address }</li>
			</ul>

			<span>Change avatar</span>
			<form onSubmit={ this.loadFile.bind(this) }>
				<input type="file" ref="image" name="image"/>
				<input type="submit"/>
			</form>
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
