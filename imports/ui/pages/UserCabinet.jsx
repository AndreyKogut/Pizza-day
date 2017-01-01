import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import ImagePicker from '../components/ImagePicker';

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

  dataChangedCallback = () => {
    this.setState({
      edited: false,
    });
  };

  updateUserData(event) {
    event.preventDefault();

    const email = this.email.value.trim();
    const name = this.name.value.trim();
    const avatar = this.avatar;

    Meteor.call(
      'user.update',
      { email, name, avatar },
      handleMethodsCallbacks(this.dataChangedCallback),
    );
  }

  render() {
    if (this.props.userDataLoading) {
      return (<div>Loading..</div>);
    }

    return (<div className="form user-cabinet">
      <form onSubmit={this.updateUserData}>
        <ul className="form__list">
          <li>
            <ImagePicker
              getImageUrl={(url) => { this.avatar = url; this.inputChanged(); }}
              currentImageUrl={this.props.avatar}
            />
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
