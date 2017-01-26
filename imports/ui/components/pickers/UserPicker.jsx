import React, { Component, PropTypes } from 'react';
import UserListItem from '../items/UserListItem';
import UserPickerFilter from '../filters/UserListFilter';
import UsersListGlobalContainer from '../lists/UsersListGlobal';

const propTypes = {
  getUsersList: PropTypes.func,
  hideItems: PropTypes.arrayOf(String),
};

const defaultProps = {
  getUsersList: () => {},
  hideItems: [],
};

class UserPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: new Set(),
      filter: {
        email: '',
        name: '',
      },
      limiter: 20,
    };
  }

  getPickedUsersIds = () => {
    const pickedItemsIds = _.pluck([...this.state.users], '_id');
    pickedItemsIds.push(...this.props.hideItems);

    return pickedItemsIds;
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

  changeFilter = (filter) => {
    const updateFilter = _.defaults(filter, {
      email: '',
      name: '',
    });

    this.setState({ filter: updateFilter });
  };

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

  render() {
    return (<div className="m-auto">
      <UserPickerFilter changeCallback={(filter) => { this.changeFilter(filter); }} />
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--6-col">
          <h5>All</h5>
          <UsersListGlobalContainer
            addedUser={(user) => { this.addUser(user); }}
            filter={this.state.filter}
            limiter={this.state.limiter}
            updateLimiter={(value) => { this.setState({ limiter: value }); }}
            hideItems={this.getPickedUsersIds()}
          />
        </div>
        <div className="mdl-cell mdl-cell--6-col">
          <h5>Members</h5>
          <ul className="user-list" onScroll={this.scrollBottom}>
            { this.getPickedUsers() }
          </ul>
        </div>
      </div>
    </div>);
  }
}

UserPicker.propTypes = propTypes;
UserPicker.defaultProps = defaultProps;

export default UserPicker;
