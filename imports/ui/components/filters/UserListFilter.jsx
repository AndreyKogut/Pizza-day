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

  return (<div className="mdl-grid">
    <div className="ta-c mdl-cell mdl-cell--6-col">
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <label
          htmlFor="email"
          className="mdl-textfield__label"
        >Email:</label>
        <input
          type="text"
          ref={(item) => { this.email = item; }}
          onChange={changeFields}
          className="mdl-textfield__input"
          id="email"
        />
      </div>
    </div>
    <div className="ta-c mdl-cell mdl-cell--6-col">
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <label
          htmlFor="name"
          className="mdl-textfield__label"
        >Name:</label>
        <input
          type="text"
          ref={(item) => { this.userName = item; }}
          onChange={changeFields}
          className="mdl-textfield__input"
          id="name"
        />
      </div>
    </div>
  </div>);
};

UserListFilter.propTypes = propTypes;

export default UserListFilter;
