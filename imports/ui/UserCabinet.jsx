import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import handleMethodsCallbacks from '../helpers/methods';
import Avatars from '../api/avatars/avatarsCollection';

const propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  avatar: PropTypes.string,
  userDataLoading: PropTypes.bool,
};

const defaultProps = {
  name: '',
  email: '',
  avatar: '',
};

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

  inputChanged() {
    this.setState({
      edited: true,
    });
  }

  imageLoadedCallback = (fileObj) => {
    fileObj.once('uploaded', () => {
      Meteor.call('user.update',
        { avatar: `/cfs/files/avatars/${fileObj._id}` });
      this.setState({
        imageId: fileObj._id,
      });
    });
  };

  imageDeletedCallback = () => {
    this.setState({
      imageId: null,
    });
  };

  dataChangeCallback = () => {
    this.setState({
      edited: false,
    });
  };

  // TODO: Change to image picker
  loadFile(event) {
    event.preventDefault();

    const file = this.image.files[0];
    if (file) {
      if (this.state.imageId) {
        Avatars.remove(
          { _id: this.state.imageId },
          handleMethodsCallbacks(this.imageDeletedCallback),
        );
      }

      Avatars.insert(file, handleMethodsCallbacks(this.imageLoadedCallback));
    }
  }

  updateUserData(event) {
    event.preventDefault();

    const userData = {
      email: this.email.value.trim(),
      name: this.name.value.trim(),
    };

    Meteor.call(
      'user.update',
      { ...userData },
      handleMethodsCallbacks(this.dataChangeCallback),
    );
  }

  render() {
    if (this.props.userDataLoading) {
      return (<div>Loading..</div>);
    }

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
          <li>
            { this.state.editable ? <a href="/create-group">Create group</a> : '' }
          </li>
        </ul>
      </form>
    </div>);
  }
}

UserCabinet.propTypes = propTypes;

UserCabinet.defaultProps = defaultProps;

const UserCabinetContainer = createContainer(({ id }) => {
  const handleUser = Meteor.subscribe('user', id);

  const user = Meteor.users.findOne(id) || {};

  _.defaults(user, {
    profile: {
      name: '',
      avatar: '',
    },
    emails: [{
      address: '',
    }],
  });

  return {
    id,
    name: user.profile.name,
    email: user.emails[0].address,
    avatar: user.profile.avatar,
    userDataLoading: !handleUser.ready(),
  };
}, UserCabinet);

export default UserCabinetContainer;
