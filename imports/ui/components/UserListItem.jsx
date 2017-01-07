import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

const propTypes = {
  userObject: PropTypes.objectOf(Object),
};

const UserListItem = ({ userObject }) => {
  _.defaults(userObject, {
    profile: {
      name: 'No name',
      avatar: '/images/user-avatar.png',
    },
    emails: [{
      address: 'No email',
    }],
  });

  return (<a
    href={FlowRouter.path('/users/:id', { id: userObject._id })}
    className="user-picker__item"
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
  </a>);
};

UserListItem.propTypes = propTypes;

export default UserListItem;
