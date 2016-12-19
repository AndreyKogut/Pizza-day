import React, {Component, PropTypes} from "react";
import {createContainer} from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";

import {Images} from "../configs/imageConfig";

export class UserCabinet extends Component {
	constructor(props) {
		super(props);

		console.log(props);

		this.state = {
			editable: this.props.id == Meteor.userId(),
			edited: false
		};
	}

	inputChanged(event) {
		console.log(event.target, this.state.email);
		this.setState({
			[event.target.ref]: event.target.name,
			edited: true
		});
	}

	// Must be changed to image picker
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
			emails: [{address: this.refs.email.value.trim()}],
			"profile.name": this.refs.name.value.trim(),
		};

		Meteor.call('updateUser', {id: this.props.id, ...userData});

		return false;
	}

	render() {

		return (<div className="user-cabinet">
			<form onSubmit={this.updateUserData.bind(this)}>
				<ul className="list">
					<li>
						<figure>
							<img src={this.props.profile.avatar} className="avatar" alt=""/>
							{ this.state.editable ?
								<figcaption>
									<input type="file" ref="image" name="image"/>
									<button onClick={ this.loadFile.bind(this) }>
										Change avatar
									</button>
								</figcaption> : ''}
						</figure>
					</li>

					<li>Name :
						<input type="text"
									 ref="name"
									 value={this.state.name}
									 placeholder="No name"
									 readOnly={!this.state.editable}
									 onChange={ this.inputChanged.bind(this) }
									 className={!this.state.editable ? 'clear-defaults' : ''}/>
					</li>

					<li>Email :
						<input type="email"
									 ref="email"
									 value={this.props.email}
									 placeholder="No email"
									 readOnly={!this.state.editable}
									 onChange={ this.inputChanged.bind(this) }
									 className={!this.state.editable ? 'clear-defaults' : ''}/>
					</li>
					{this.state.editable && this.state.edited ?
						<li>
							<input type="submit" value={'Update user data'}/>
						</li> : ''}
				</ul>
			</form>
		</div>);
	}
}

UserCabinet.propTypes = {
	id: PropTypes.string,
	profile: PropTypes.object,
	email: PropTypes.string,
};

export const UserCabinetContainer = createContainer(({id}) => {
	Meteor.subscribe('avatarLoading', id);

	const {
		profile = {},
		emails : [
			{
				address : email
			} = {}
		] = []
	} = Meteor.users.findOne(id) || {};

	return {
		id,
		profile,
		email
	}
}, UserCabinet);