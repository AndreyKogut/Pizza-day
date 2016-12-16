import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";

import {Images} from "../configs/imageConfig";

export class UserCabinet extends Component {
	constructor(props) {
		super(props);
	}

	// Must be changed to
	loadFile(event) {
		event.preventDefault();

		const file = this.refs.image.files[0];

		if (file) {
			Images.insert(file, (err, fileObj) => {
				if (err) {
					throw new Error(err.reason);
				} else {

					fileObj.once('uploaded', () => {
						Meteor.call('updateUser', {id: Meteor.userId(), "profile.avatar": `/cfs/files/avatars/${fileObj._id}`});
					});
				}
			});
		}

		return false;
	}

	updateUserData(event) {
		event.preventDefault();

		const userData = {
			emails: [{ address: this.refs.email.value.trim() }],
			"profile.name" : this.refs.name.value.trim(),
		};

		Meteor.call('updateUser', {id: this.props.id, ...userData});

		return false;
	}


	render() {

		return (<div>
			<h3>Profile data</h3>

			<div>
				<form onSubmit={this.updateUserData.bind(this)}>
					<ul className="list">
						<li>
							<figure>
								<img src={this.props.profile.avatar} className="avatar" alt=""/>
								<figcaption>
									<input type="file" ref="image" name="image"/>
									<button onClick={ this.loadFile.bind(this) }>
										Change avatar
									</button>
								</figcaption>
							</figure>
						</li>
						<li>Name : <input type="text" defaultValue={this.props.profile.name} ref="name"/></li>
						<li>Email :
							<input type="text"
										 defaultValue={this.props.emails[0].address || ""}
										 placeholder="No emails"
										 ref="email"/>
						</li>
						<li>
							<input type="submit" value={'Update user data'}/>
						</li>
					</ul>
				</form>

			</div>
		</div>);
	}
}

UserCabinet.propTypes = {
	id: PropTypes.string,
	profile: PropTypes.object,
	emails: PropTypes.array,
};

export const UserCabinetContainer = createContainer(({id}) => {
	Meteor.subscribe('avatarLoading');

	let {
		profile,
		emails
	} = Meteor.users.findOne(id);

	return {
		id,
		profile,
		emails
	}
}, UserCabinet);