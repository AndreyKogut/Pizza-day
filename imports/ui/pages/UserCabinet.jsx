import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import Controls from '../components/Controls';

const propTypes = {
  id: PropTypes.string,
  user: PropTypes.objectOf(Object),
  userDataLoading: PropTypes.bool,
};

const UserCabinet = (props) => {
  const editable = props.id === Meteor.userId();

  function updateUserData(obj) {
    Meteor.call(
      'user.update',
      obj,
      handleMethodsCallbacks,
    );
  }

  if (props.userDataLoading) {
    return (<div>Loading..</div>);
  }

  return (<div className="form user-cabinet">
    <Controls
      controls={{ avatar: true }}
      updateImage={(imageUrl) => { updateUserData({ avatar: imageUrl }); }}
    />
    <ul className="form__list">
      <li>
        <img
          src={props.user.profile.avatar}
          alt={props.user.profile.name}
          className="avatar"
        />
      </li>
      <li>
        <label htmlFor={props.user.profile.name}>Name : </label>
        <input
          type="text"
          ref={(name) => { this.userName = name; }}
          defaultValue={props.user.profile.name}
          placeholder="No name"
          readOnly={!editable}
          id={props.user.profile.name}
          onChange={() => { updateUserData({ name: this.userName.value }); }}
          className={!editable ? 'clear-defaults' : ''}
        />
      </li>
      <li>
        <label htmlFor={props.user.profile.about}>About : </label>
        <textarea
          ref={(about) => { this.about = about; }}
          defaultValue={props.user.profile.about}
          placeholder="No name"
          readOnly={!editable}
          id={props.user.profile.about}
          onChange={() => { updateUserData({ about: this.about.value }); }}
          className={!editable ? 'clear-defaults' : ''}
        />
      </li>
      <li>
        <label htmlFor={props.user.profile.company}>Company name : </label>
        <input
          type="text"
          ref={(company) => { this.company = company; }}
          defaultValue={props.user.profile.company}
          placeholder="No name"
          readOnly={!editable}
          id={props.user.profile.company}
          onChange={() => { updateUserData({ company: this.company.value }); }}
          className={!editable ? 'clear-defaults' : ''}
        />
      </li>
      <li>
        <label htmlFor={props.user.profile.position}>Position : </label>
        <input
          type="text"
          ref={(position) => { this.position = position; }}
          defaultValue={props.user.profile.position}
          placeholder="No name"
          readOnly={!editable}
          id={props.user.profile.position}
          onChange={() => { updateUserData({ position: this.position.value }); }}
          className={!editable ? 'clear-defaults' : ''}
        />
      </li>
      <li>
        <label htmlFor={props.user.emails[0].address}>Email :</label>
        <input
          type="email"
          ref={(email) => { this.email = email; }}
          defaultValue={props.user.emails[0].address}
          placeholder="No name"
          readOnly={!editable}
          id={props.user.emails[0].address}
          onChange={() => { updateUserData({ email: this.email.value }); }}
          className={!editable ? 'clear-defaults' : ''}
        />
      </li>
      <li>
        { editable ? <a href="/create-group">Create group</a> : '' }
      </li>
    </ul>
  </div>);
};

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
