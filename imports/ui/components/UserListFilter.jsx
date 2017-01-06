import React, { PropTypes } from 'react';

const propTypes = {
  changeCallback: PropTypes.func,
};

const UserListFilter = ({ changeCallback }) => {
  const changeFields = () => {
    const name = this.userName.value;
    const email = this.email.value;

    changeCallback({ name, email });
  };

  return (<div className="user-picker__filter">
    <label
      htmlFor="email"
      className="user-picker__label"
    >Email:</label>
    <input
      type="text"
      ref={(item) => { this.email = item; }}
      onChange={changeFields}
      className="user-picker__input clear-defaults"
      id="email"
    />
    <label
      htmlFor="name"
      className="user-picker__label"
    >Name:</label>
    <input
      type="text"
      ref={(item) => { this.userName = item; }}
      onChange={changeFields}
      className="user-picker__input clear-defaults"
      id="name"
    />
  </div>);
};

UserListFilter.propTypes = propTypes;

export default UserListFilter;
