import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Groups from '../api/groups/collection';
import Menu from '../api/menu/collection';
import Events from '../api/events/collection';
import MenuList from './MenuList';
import EventsList from './EventsList';

const propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  avatar: PropTypes.string,
  creator: PropTypes.string,
  events: PropTypes.arrayOf(Object),
  menu: PropTypes.arrayOf(Object),
  groupLoading: PropTypes.bool,
  menuLoading: PropTypes.bool,
  eventsLoading: PropTypes.bool,
};

const defaultProps = {
  events: [],
};

class GroupPage extends Component {
  getMenu() {
    if (this.props.menuLoading) {
      return <div>Menu loading...</div>;
    }

    return <MenuList items={this.props.menu} />;
  }

  getEvents() {
    if (this.props.eventsLoading) {
      return <div>Events loading...</div>;
    }

    return <EventsList list={this.props.events} />;
  }

  checkCreator() {
    return this.props.creator === Meteor.userId();
  }

  render() {
    if (this.props.groupLoading) {
      return <div>Loading..</div>;
    }

    return (<div className="group">
      <ul className="group__info">
        <li><img src={this.props.avatar} className="avatar" alt="" /></li>
        <li><div>Name: { this.props.name }</div></li>
        <li><div>Description: { this.props.description }</div></li>
        <li className="div">
          Events:
          <br />
          { this.getEvents() }
          <br />
        </li>
        { this.checkCreator() ? <li>
          <a href={FlowRouter.path('/groups/:id/create-event', { id: this.props.id })}>Create</a>
        </li> : '' }
      </ul>
      <div className="group__menu">
        <h1 className="group__menu-header">Menu</h1>
        { this.getMenu() }
      </div>
    </div>);
  }
}

GroupPage.propTypes = propTypes;
Event.defaultProps = defaultProps;

const GroupPageContainer = createContainer(({ id }) => {
  const handleGroup = Meteor.subscribe('Group', id);
  const handleGroupMenu = Meteor.subscribe('GroupMenu', id);
  const handleGroupEvents = Meteor.subscribe('GroupEvents', id);

  const groupData = Groups.findOne() || {};

  return {
    id,
    ...groupData,
    menu: Menu.find().fetch(),
    events: Events.find().fetch(),
    groupLoading: !handleGroup.ready(),
    menuLoading: !handleGroupMenu.ready(),
    eventsLoading: !handleGroupEvents.ready(),
  };
}, GroupPage);

export default GroupPageContainer;
