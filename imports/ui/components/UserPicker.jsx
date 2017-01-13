import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import UserListItem from '../../ui/components/UserListItem';
import UserPickerFilter from '../../ui/components/UserListFilter';

const propTypes = {
  list: PropTypes.arrayOf(Object),
  getUsersList: PropTypes.func,
  usersLoading: PropTypes.bool,
};

const defaultProps = {
  list: [],
  getUsersList: () => {},
};

class UserPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: new Set(),
    };
  }

  getAllUsers = () => {
    let filteredData;

    if (!this.state.filteredUsers) {
      filteredData = this.props.list;
    } else {
      filteredData = this.state.filteredUsers;
    }

    return filteredData.map((user) => {
      if (_.some([...this.state.users], val => user._id === val._id)) return '';

      return (<li
        className="mdl-list__item mdl-list__item--two-line"
        key={user._id}
      >
        <UserListItem userObject={user} />
        <div className="mdl-list__item-secondary-content">
          <button
            type="button"
            className="mdl-button mdl-js-button mdl-button--icon"
            onClick={() => { this.addUser(user); }}
          >
            <i className="material-icons">add</i>
          </button>
        </div>
      </li>);
    });
  };

  getPickedUsers = () =>
    [...this.state.users].map(user =>
      (<li
        className="mdl-list__item mdl-list__item--two-line"
        key={user._id}
      >
        <UserListItem
          userObject={user}
        />
        <div className="mdl-list__item-secondary-content">
          <button
            type="button"
            className="mdl-button mdl-js-button mdl-button--icon"
            onClick={() => { this.deleteUser(user); }}
          >
            <i className="material-icons">remove</i>
          </button>
        </div>
      </li>));

  addUser = (user) => {
    const newState = new Set(this.state.users);
    newState.add(user);

    this.setState({
      users: newState,
    }, () => {
      this.props.getUsersList(_.pluck([...this.state.users], '_id'));
    });
  };

  deleteUser(user) {
    const newState = new Set(this.state.users);
    newState.delete(user);

    this.setState({
      users: newState,
    }, () => {
      this.props.getUsersList(_.pluck([...this.state.users], '_id'));
    });
  }

  filterUsers = ({ name = '', email = '' }) => {
    const filteredUsers = this.props.list.filter(
      (user) => {
        _.defaults(user, {
          profile: {
            name: '',
          },
          emails: [{
            address: '',
          }],
        });

        return user.emails[0].address.includes(email) &&
          user.profile.name.includes(name);
      },
    );

    this.setState({
      filteredUsers,
    });
  };

  render() {
    if (this.props.usersLoading) {
      return <div>Loading...</div>;
    }

    return (<div className="m-auto">
      <UserPickerFilter changeCallback={(filter) => { this.filterUsers(filter); }} />
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--6-col">
          <h5>All</h5>
          <ul className="user-list">
            { this.getAllUsers() }
          </ul>
        </div>
        <div className="mdl-cell mdl-cell--6-col">
          <h5>Members</h5>
          <ul className="user-list">
            { this.getPickedUsers() }
          </ul>
        </div>
      </div>
    </div>);
  }
}

UserPicker.propTypes = propTypes;
UserPicker.defaultProps = defaultProps;

const UserPickerContainer = createContainer(({ hideItems, ...props }) => {
  const handleUsers = Meteor.subscribe('UsersList');

  const convertToStringsList = _.pluck(hideItems, '_id');

  const list = Meteor.users.find({ _id: { $nin: convertToStringsList } }).fetch();

  return {
    ...props,
    list,
    usersLoading: !handleUsers.ready(),
  };
}, UserPicker);

export default UserPickerContainer;
