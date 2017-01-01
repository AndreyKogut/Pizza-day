import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Groups from '../../api/groups/collection';
import Menu from '../../api/menu/collection';
import Events from '../../api/events/collection';
import MenuList from '../components/MenuList';
import EventsList from '../components/EventsList';
import UsersList from '../components/UsersList';

const propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  avatar: PropTypes.string,
  creator: PropTypes.string,
  events: PropTypes.arrayOf(Object),
  menu: PropTypes.arrayOf(Object),
  members: PropTypes.arrayOf(Object),
  groupLoading: PropTypes.bool,
  menuLoading: PropTypes.bool,
  eventsLoading: PropTypes.bool,
  membersLoading: PropTypes.bool,
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

  getUsers() {
    if (this.props.membersLoading) {
      return <div>Members loading...</div>;
    }

    return <UsersList items={this.props.members} />;
  }

  checkCreator() {
    return this.props.creator === Meteor.userId();
  }

  render() {
    if (this.props.groupLoading) {
      return <div>Loading..</div>;
    }

    return (<div className="group">
      <div className="group__info">
        <p><img src={this.props.avatar} className="avatar" alt="" /></p>
        <p>Name: { this.props.name }</p>
        <p>Description: { this.props.description }</p>
      </div>
      <h3 className="group__h">Events</h3>
      <div className="group__events">
        { this.getEvents() }
        { this.checkCreator() ?
          <a href={FlowRouter.path('/groups/:id/create-event', { id: this.props.id })}>Create</a>
          : '' }
      </div>
      <h3 className="group__h">Members</h3>
      <div className="group__members">
        { this.getUsers() }
      </div>
      <h3 className="group__h">Menu</h3>
      <div className="group__menu">
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
  const handleGroupMembers = Meteor.subscribe('GroupMembers', id);

  const groupData = Groups.findOne() || {};

  return {
    id,
    ...groupData,
    menu: Menu.find().fetch(),
    events: Events.find().fetch(),
    members: Meteor.users.find().fetch(),
    groupLoading: !handleGroup.ready(),
    menuLoading: !handleGroupMenu.ready(),
    eventsLoading: !handleGroupEvents.ready(),
    membersLoading: !handleGroupMembers.ready(),
  };
}, GroupPage);

export default GroupPageContainer;
