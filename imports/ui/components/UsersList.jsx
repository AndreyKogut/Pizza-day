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

      return (<li
        className="mdl-list__item mdl-list__item--two-line"
        key={item._id}
      >
        <UserListItem userObject={item} />
        { editable && <div className="mdl-list__item-secondary-content">
          <button
            type="button"
            className="mdl-button mdl-js-button mdl-button--icon"
            onClick={() => { itemClick(item._id); }}
          ><i className="material-icons">clear</i></button></div> }
      </li>);
    });

  return (<ul className="mdl-list">
    { getList() }
  </ul>);
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
