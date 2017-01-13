import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { createContainer } from 'meteor/react-meteor-data';

const propTypes = {
  id: PropTypes.string,
};

const Header = ({ id }) => {
  const logout = () => {
    Meteor.logout();
  };

  return (<header className="mdl-layout__header">
    <div className="mdl-layout__header-row">
      <span className="mdl-layout-title">Pizza-day</span>
      <div className="mdl-layout-spacer" />
      <nav className="mdl-navigation">
        <a href="/groups" className="mdl-navigation__link">Groups</a>
        <a href="/events" className="mdl-navigation__link">Events</a>
        { id ? <div className="wrap-items">
          <a
            className="mdl-navigation__link"
            href={FlowRouter.path('/users/:id', { id })}
          >Cabinet</a>
          <button
            id="logout"
            onClick={logout}
            className="as-c mdl-button mdl-js-button mdl-button--icon"
          ><i className="material-icons">exit_to_app</i></button></div> :
        <div className="wrap-items">
          <a
            className="mdl-button mdl-js-button mdl-js-ripple-effect"
            href="/signup"
          >Sign up</a>
          <a
            className="mdl-button mdl-js-button mdl-js-ripple-effect"
            href="/login"
          >Login</a>
        </div>}
      </nav>
    </div>
    <div className="mdl-tooltip" data-mdl-for="logout">
      Logout
    </div>

  </header>);
};

Header.propTypes = propTypes;

const HeaderContainer = createContainer(() => {
  const id = Meteor.userId();

  return {
    id,
  };
}, Header);

export default HeaderContainer;
