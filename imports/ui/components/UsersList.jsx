import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import UserListItem from '../components/UserListItem';

const propTypes = {
  items: PropTypes.arrayOf(Object),
  usersLoading: PropTypes.bool,
  itemClick: PropTypes.func,
  editable: PropTypes.bool,
};

const defaultProps = {
  items: [{}],
  itemClick: () => {},
};

const UsersList = ({ items, usersLoading, itemClick, editable }) => {
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

      return (<div key={item._id}>
        <UserListItem userObject={item} />
        { editable ?
          <button
            type="button"
            onClick={() => { itemClick(item._id); }}
          >add/remove</button> : '' }
      </div>);
    });

  return (<div className="users-list">
    { getList() }
  </div>);
};

const GroupUsersList = createContainer(({ id, ...params }) => {
  const handleUsers = Meteor.subscribe('GroupMembers', id);

  return {
    items: Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch(),
    ...params,
    usersLoading: !handleUsers.ready(),
  };
}, UsersList);

UsersList.propTypes = propTypes;
UsersList.defaultProps = defaultProps;

export default UsersList;
export {
  GroupUsersList,
};
