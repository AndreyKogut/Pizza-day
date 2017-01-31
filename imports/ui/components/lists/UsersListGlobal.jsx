import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import UserListItem from '../items/UserListItem';

const propTypes = {
  list: PropTypes.arrayOf(Object),
  usersLoading: PropTypes.bool,
  notLoaded: PropTypes.bool,
  addedUser: PropTypes.func,
  limiter: PropTypes.number,
  updateLimiter: PropTypes.func,
};

const defaultProps = {
  list: [],
  getUsersList: () => {},
};

const UsersListGlobal = (props) => {
  function addUser(user) {
    props.addedUser(user);
  }

  function getAllUsers() {
    return props.list.map(user => (<li
      className="mdl-list__item mdl-list__item--two-line"
      key={user._id}
    >
      <UserListItem userObject={user} />
      <div className="mdl-list__item-secondary-content">
        <button
          type="button"
          className="mdl-button mdl-js-button mdl-button--icon"
          onClick={() => { addUser(user); }}
        >
          <i className="material-icons">add</i>
        </button>
      </div>
    </li>));
  }

  const scrollBottom = (event) => {
    if (props.notLoaded) {
      const scrollPosition = event.target.scrollTop;
      const maxScrollHeight = event.target.scrollHeight - event.target.offsetHeight;
      if (scrollPosition >= maxScrollHeight) {
        props.updateLimiter(props.limiter + 10);
      }
    }
  };

  if (!props.list.length) {
    return <div className="empty-list" />;
  }

  return (<ul className="user-list" onScroll={scrollBottom}>
    { getAllUsers() }
    { props.usersLoading && <div className="spinner mdl-spinner mdl-js-spinner is-active" /> }
  </ul>);
};

UsersListGlobal.propTypes = propTypes;
UsersListGlobal.defaultProps = defaultProps;

const UsersListGlobalContainer =
  createContainer(({ hideItems = [], filter, limiter, ...props }) => {
    const handleUsers = Meteor.subscribe('UsersListFilter', { filter, limiter });
    const list = Meteor.users.find({
      _id: { $nin: hideItems },
      'profile.name': { $regex: `.*${filter.name}.*` },
      'emails.address': { $regex: `.*${filter.email}.*` },
      'emails.verified': true,
    }, { limit: limiter }).fetch();

    return {
      ...props,
      list,
      limiter,
      notLoaded: limiter === list.length,
      usersLoading: !handleUsers.ready(),
    };
  }, UsersListGlobal);

export default UsersListGlobalContainer;
