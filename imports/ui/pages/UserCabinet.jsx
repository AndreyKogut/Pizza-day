import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import ImagePicker from '../components/ImagePicker';

const propTypes = {
  id: PropTypes.string,
  user: PropTypes.objectOf(Object),
  userDataLoading: PropTypes.bool,
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
    const position = this.position.value.trim();
    const company = this.company.value.trim();
    const about = this.about.value.trim();

    Meteor.call(
      'user.update',
      { email, name, avatar, about, company, position },
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
            { this.state.editable ? <ImagePicker
              getImageUrl={(url) => { this.props.user.profile.avatar = url; this.inputChanged(); }}
              currentImageUrl={this.props.user.profile.avatar}
            /> : <img
              src={this.props.user.profile.avatar}
              alt={this.props.user.profile.name}
              className="avatar"
            /> }
          </li>
          <li>
            <label htmlFor={this.props.user.profile.name}>Name : </label>
            <input
              type="text"
              ref={(name) => { this.name = name; }}
              defaultValue={this.props.user.profile.name}
              placeholder="No name"
              readOnly={!this.state.editable}
              id={this.props.user.profile.name}
              onChange={this.inputChanged}
              className={!this.state.editable ? 'clear-defaults' : ''}
            />
          </li>
          <li>
            <label htmlFor={this.props.user.profile.about}>About : </label>
            <textarea
              ref={(about) => { this.about = about; }}
              defaultValue={this.props.user.profile.about}
              placeholder="No name"
              readOnly={!this.state.editable}
              id={this.props.user.profile.about}
              onChange={this.inputChanged}
              className={!this.state.editable ? 'clear-defaults' : ''}
            />
          </li>
          <li>
            <label htmlFor={this.props.user.profile.company}>Company name : </label>
            <input
              type="text"
              ref={(company) => { this.company = company; }}
              defaultValue={this.props.user.profile.company}
              placeholder="No name"
              readOnly={!this.state.editable}
              id={this.props.user.profile.company}
              onChange={this.inputChanged}
              className={!this.state.editable ? 'clear-defaults' : ''}
            />
          </li>
          <li>
            <label htmlFor={this.props.user.profile.position}>Position : </label>
            <input
              type="text"
              ref={(position) => { this.position = position; }}
              defaultValue={this.props.user.profile.position}
              placeholder="No name"
              readOnly={!this.state.editable}
              id={this.props.user.profile.position}
              onChange={this.inputChanged}
              className={!this.state.editable ? 'clear-defaults' : ''}
            />
          </li>
          <li>
            <label htmlFor={this.props.user.emails[0].address}>Email :</label>
            <input
              type="email"
              ref={(email) => { this.email = email; }}
              defaultValue={this.props.user.emails[0].address}
              placeholder="No name"
              readOnly={!this.state.editable}
              id={this.props.user.emails[0].address}
              onChange={this.inputChanged}
              className={!this.state.editable ? 'clear-defaults' : ''}
            />
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

const UserCabinetContainer = createContainer(({ id }) => {
  const handleUser = Meteor.subscribe('user', id);

  const user = Meteor.users.findOne(id) || {};

  _.defaults(user, {
    profile: {
      name: '',
      avatar: '',
      about: '',
      company: '',
      position: '',
    },
    emails: [{
      address: '',
    }],
  });

  return {
    id,
    user,
    userDataLoading: !handleUser.ready(),
  };
}, UserCabinet);

export default UserCabinetContainer;
