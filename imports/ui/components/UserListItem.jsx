import React, { PropTypes } from 'react';

const propTypes = {
  userObject: PropTypes.objectOf(Object),
  clickCallback: PropTypes.func,
};

const UserListItem = ({ userObject, clickCallback }) => {
  _.defaults(userObject, {
    profile: {
      name: 'No name',
      avatar: '/images/user-avatar.png',
    },
    emails: [{
      address: 'No email',
    }],
  });

  return (<button
    onClick={() => { clickCallback(userObject); }}
    type="button"
    className="user-picker__item clear-defaults"
  >
    <img
      src={userObject.profile.avatar}
      className="user-picker__image"
      alt={userObject.profile.name}
    />
    <div className="user-picker__info">
      <span className="user-picker__text">{ userObject.profile.name }</span>
      <span className="user-picker__text">{ userObject.emails[0].address }</span>
    </div>
  </button>);
};

UserListItem.propTypes = propTypes;

export default UserListItem;
