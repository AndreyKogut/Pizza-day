import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { createContainer } from 'meteor/react-meteor-data';

const propTypes = {
  items: PropTypes.arrayOf(Object),
  usersLoading: PropTypes.bool,
};

const defaultProps = {
  items: [{}],
};

const UsersList = ({ items, usersLoading }) => {
  if (usersLoading) {
    return <div>Users loading...</div>;
  }

  const getList = () =>
    items.map((item) => {
      _.defaults(item, {
        emails: [{
          address: '',
        }],
        profile: {
          avatar: '',
          name: '',
        },
      });

      return (<li className="users-list__item" key={item._id}>
        <a href={FlowRouter.path('/users/:id', { id: item._id })} className="users-list__link">
          <img src={item.profile.avatar} alt={item.profile.name} className="users-list__image" />
          <span className="users-list__description">
            { item.profile.name ? item.profile.name : item.emails[0].address }
          </span>
        </a>
      </li>);
    });

  return (<ul className="users-list">
    { getList() }
  </ul>);
};

const GroupUsersList = createContainer(({ id }) => {
  const handleUsers = Meteor.subscribe('GroupMembers', id);

  return {
    items: Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch(),
    usersLoading: !handleUsers.ready(),
  };
}, UsersList);

UsersList.propTypes = propTypes;
UsersList.defaultProps = defaultProps;

export default UsersList;
export {
  GroupUsersList,
};
