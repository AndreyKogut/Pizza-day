import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

const propTypes = {
  list: PropTypes.arrayOf(Object),
  getUsersList: PropTypes.func,
  usersLoading: PropTypes.bool,
};

const defaultProps = {
  list: [{}],
};

class UserPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: new Set(),
    };
  }

  getUsersAllUsers = () =>
    this.props.list.map((user) => {
      if (this.state.users.has(user)) return '';
        _.defaults(user, {
          profile: {
            name: 'No name',
          },
          emails: [{
            address: 'No email',
          }],
        });

      return (<button
        type="button"
        className="user-picker__item clear-defaults"
        onClick={() => { this.addUser(user); }} key={user._id}
      >
        Name: { user.profile.name }, Email: { user.emails[0].address }
      </button>);
    });

  getPickedUsers = () =>
    [...this.state.users].map((user) => {
      _.defaults(user, {
        profile: {
          name: 'No name',
        },
        emails: [{
          address: 'No email',
        }],
      });

      return (<button
        type="button"
        className="user-picker__item clear-defaults"
        onClick={() => { this.deleteUser(user); }}
        key={user._id}
      >
        Name: { user.profile.name }, Email: { user.emails[0].address }
      </button>);
    });

  getArrayOfUsers() {
    const usersList = [];

    [...this.state.users].map(({ _id: id }) => usersList.push(id));

    return usersList;
  }

  addUser = (user) => {
    const newState = new Set(this.state.users);
    newState.add(user);

    this.setState({
      users: newState,
    }, () => {
      this.props.getUsersList(this.getArrayOfUsers());
    });
  };

  deleteUser(user) {
    const newState = new Set(this.state.users);
    newState.delete(user);

    this.setState({
      users: newState,
    }, () => {
      this.props.getUsersList(this.getArrayOfUsers());
    });
  }

  render() {
    if (this.props.usersLoading) {
      return <div>Loading...</div>;
    }

    return (<div className="user-picker">
      <div className="user-picker__all">
        <h3 className="user-picker__h">Users:</h3>
        <div className="user-picker__list">
          { this.getUsersAllUsers() }
        </div>
      </div>
      <div className="user-picker__picked">
        <h3 className="user-picker__h">Picked:</h3>
        <div className="user-picker__list">
          { this.getPickedUsers() }
        </div>
      </div>
    </div>);
  }
}

UserPicker.propTypes = propTypes;
UserPicker.defaultProps = defaultProps;

const UserPickerContainer = createContainer(({ getUsersList }) => {
  const handleUsers = Meteor.subscribe('Users');

  return {
    getUsersList,
    list: Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch(),
    usersLoading: !handleUsers.ready(),
  };
}, UserPicker);

export default UserPickerContainer;
