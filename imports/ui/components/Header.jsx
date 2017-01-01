import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { createContainer } from 'meteor/react-meteor-data';

const propTypes = {
  id: PropTypes.string,
};

function Header({ id }) {
  const logout = () => {
    Meteor.logout();
  };

  return (<header className="header">
    <nav className="header__nav">
      <ul className="header__list cf">
        <li className="header__item">
          <a href="/" className="header__link">Home</a>
        </li>
        <li className="header__item">
          <a href="/groups" className="header__link">Groups</a>
        </li>
        <li className="header__item">
          <a href="/events" className="header__link">Events</a>
        </li>
        { id ?
          <li className="header__item header__item_login">
            <a
              className="header__link"
              href={FlowRouter.path('/users/:id', { id })}
            >Cabinet</a>
            <button
              onClick={logout}
              className="header__link header__link_logout clear-defaults"
            >Logout</button>
          </li>
          :
          <li className="header__item header__item_login">
            <a href="/signup" className="header__link">Sign up</a>
            <span className="header__separator">/</span>
            <a href="/signin" className="header__link">Sign in</a>
          </li>}
      </ul>
    </nav>
  </header>);
}

Header.propTypes = propTypes;

const HeaderContainer = createContainer(() => {
  const id = Meteor.userId();

  return {
    id,
  };
}, Header);

export default HeaderContainer;
