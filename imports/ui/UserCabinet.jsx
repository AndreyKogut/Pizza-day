import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Avatars from '../api/avatars';

class UserCabinet extends Component {
  constructor(props) {
    super(props);
    this.loadFile = this.loadFile.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
    this.state = {
      editable: this.props.id === Meteor.userId(),
      edited: false,
      imageId: null,
    };
  }
  getInput(type, ref, defaultValue) {
    if (this.props.dataLoaded) {
      return (<input
        type={type}
        ref={ref}
        defaultValue={defaultValue}
        placeholder="No name"
        readOnly={!this.state.editable}
        id={defaultValue}
        onChange={this.inputChanged}
        className={!this.state.editable ? 'clear-defaults' : ''}
      />);
    }

    return '';
  }

  inputChanged() {
    this.setState({
      edited: true,
    });
  }

  // Must be changed to image picker
  loadFile(event) {
    event.preventDefault();

    const file = this.image.files[0];
    if (file) {
      if (this.state.imageId) {
        Avatars.remove({ _id: this.state.imageId }, (err) => {
          if (!err) {
            this.setState({
              imageId: null,
            });
          }
        });
      }

      Avatars.insert(file, (err, fileObj) => {
        if (err) {
          throw new Error(err.reason);
        } else {
          fileObj.on('uploaded', () => {
            Meteor.call('user.update',
              { id: this.props.id, avatar: `/cfs/files/avatars/${fileObj._id}` });
            this.setState({
              imageId: fileObj._id,
            });
          });
        }
      });
    }
  }

  updateUserData(event) {
    event.preventDefault();

    const userData = {
      email: this.email.value.trim(),
      name: this.name.value.trim(),
    };

    Meteor.call('user.update', { id: this.props.id, ...userData }, (err) => {
      if (!err) {
        this.setState({
          edited: false,
        });
      }
    });

    return false;
  }

  render() {
    return (<div className="form user-cabinet">
      <form onSubmit={this.updateUserData}>
        <ul className="form__list">
          <li className="form__item">
            <figure>
              <img src={this.props.avatar} className="avatar" alt="" />
              { this.state.editable ?
                <figcaption>
                  <input type="file" ref={(image) => { this.image = image; }} />
                  <button onClick={this.loadFile}>
                    Change avatar
                  </button>
                </figcaption> : ''}
            </figure>
          </li>

          <li>
            <label htmlFor={this.props.name}>Name : </label>
            { this.getInput('text', (name) => { this.name = name; }, this.props.name) }
          </li>
          <li>Email : { this.getInput('email', (email) => { this.email = email; }, this.props.email) }

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
  name: PropTypes.string,
  email: PropTypes.string,
  avatar: PropTypes.string,
  dataLoaded: PropTypes.bool,
};

const UserCabinetContainer = createContainer(({ id }) => {
  Meteor.subscribe('user', id);

  const user = Meteor.users.findOne(id);
  const userData = {
    name: '',
    email: '',
    avatar: '',
    dataLoaded: false,
  };

  if (user) {
    userData.name = user.profile ? user.profile.name : '';
    userData.email = user.emails.length ? user.emails[0].address : '';
    userData.avatar = user.profile ? user.profile.avatar : '';
    userData.dataLoaded = true;
  }

  return {
    id,
    ...userData,
  };
}, UserCabinet);

export default UserCabinetContainer;
