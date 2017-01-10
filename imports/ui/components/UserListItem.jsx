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
    className="mdl-list__item-primary-content"
  >
    <img
      src={userObject.profile.avatar}
      className="user-list-avatar mdl-list__item-avatar"
      alt={userObject.profile.name}
    />
    <span>{ userObject.profile.name }</span>
    <span className="mdl-list__item-sub-title">{ userObject.emails[0].address }</span>
  </a>);
};

UserListItem.propTypes = propTypes;

export default UserListItem;
