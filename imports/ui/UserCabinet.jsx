import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import Images from '../configs/imageConfig';

class UserCabinet extends Component {
  constructor(props) {
    super(props);
    this.loadFile = this.loadFile.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
    this.state = {
      editable: this.props.id === Meteor.userId(),
      edited: false,
      name: this.props.profile.name,
      email: this.props.email,
    };
  }

  inputChanged() {
    this.setState({
      name: this.name.value.trim(),
      email: this.email.value.trim(),
      edited: true,
    });
  }

  // Must be changed to image picker
  loadFile(event) {
    event.preventDefault();
    const file = this.image.files[0];
    if (file) {
      Images.insert(file, (err, fileObj) => {
        if (err) {
          throw new Error(err.reason);
        } else {
          fileObj.once('uploaded', () => {
            Meteor.call('user.update', { id: Meteor.userId(), 'profile.avatar': `/cfs/files/avatars/${fileObj._id}` });
          });
        }
      });
    }
    return false;
  }

  updateUserData(event) {
    event.preventDefault();

    const userData = {
      emails: [{ address: this.email.value.trim() }],
      'profile.name': this.name.value.trim(),
    };

    Meteor.call('user.update', { id: this.props.id, ...userData });

    return false;
  }

  render() {
    return (<div className="user-cabinet">
      <form onSubmit={this.updateUserData}>
        <ul className="list">
          <li>
            <figure>
              <img src={this.props.profile.avatar} className="avatar" alt="" />
              { this.state.editable ?
                <figcaption>
                  <input type="file" ref={(image) => { this.image = image; }} />
                  <button onClick={this.loadFile}>
                    Change avatar
                  </button>
                </figcaption> : ''}
            </figure>
          </li>

          <li>Name :
            <input
              type="text"
              ref={(name) => { this.name = name; }}
              value={this.state.name}
              placeholder="No name"
              readOnly={!this.state.editable}
              onChange={this.inputChanged}
              className={!this.state.editable ? 'clear-defaults' : ''}
            />
          </li>

          <li>Email :
            <input
              type="email"
              ref={(email) => { this.email = email; }}
              value={this.state.email}
              placeholder="No email"
              readOnly={!this.state.editable}
              onChange={this.inputChanged}
              className={!this.state.editable ? 'clear-defaults' : ''}
            />
          </li>
          {this.state.editable && this.state.edited ?
            <li>
              <input type="submit" value="Update user data" />
            </li> : ''}
        </ul>
      </form>
    </div>);
  }
}

UserCabinet.propTypes = {
  id: PropTypes.string,
  profile: React.PropTypes.objectOf(PropTypes.any),
  email: PropTypes.string,
};

const UserCabinetContainer = createContainer(({ id }) => {
  Meteor.subscribe('user', id);

  const {
    profile = {},
    emails: [
      {
        address: email,
      } = {},
    ] = [],
  } = Meteor.users.findOne(id) || {};

  return {
    id,
    profile,
    email,
  };
}, UserCabinet);

export default UserCabinetContainer;
