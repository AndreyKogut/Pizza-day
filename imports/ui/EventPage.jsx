import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import MenuPicker from './MenuPicker';
import Events from '../api/events/collection';
import Menu from '../api/menu/collection';

const propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
  menu: PropTypes.arrayOf(Object),
  eventLoading: PropTypes.bool,
  menuLoading: PropTypes.bool,
};

class EventPage extends Component {
  constructor(props) {
    super(props);
    this.menu = [];
  }

  getMenu() {
    if (this.props.menuLoading) {
      return <div>Menu loading..</div>;
    }

    return (<MenuPicker
      items={this.props.menu}
      getMenuList={(list) => { this.menu = [...list]; }}
      withCounters
    />);
  }
  render() {
    if (this.props.eventLoading) {
      return <div>Loading event...</div>;
    }

    return (<div className="event-page">
      <ul className="event-page__info">
        <li>Name: { this.props.name }({ this.props.status })</li>
        <li>Title: { this.props.title }</li>
        <li>Date: { this.props.date }</li>
      </ul>
      <div className="event-page__menu">
        { this.getMenu() }
      </div>
    </div>);
  }
}

EventPage.propTypes = propTypes;

const EventPageContainer = createContainer(({ eventId }) => {
  const handleEvent = Meteor.subscribe('Event', eventId);
  const handleMenu = Meteor.subscribe('EventMenu', eventId);

  const event = Events.findOne() || {};

  return {
    ...event,
    menu: Menu.find().fetch(),
    eventLoading: !handleEvent.ready(),
    menuLoading: !handleMenu.ready(),
  };
}, EventPage);

export default EventPageContainer;
