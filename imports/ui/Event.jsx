import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import MenuPicker from './MenuPicker';
import Events from '../api/events/collection';
import Menu from '../api/menu/collection';

class Event extends Component {
  constructor(props) {
    super(props);
    this.menu = [];
  }

  render() {
    return (<div className="event-page">
      <ul className="event-page__info">
        <li>Name: { this.props.name }({ this.props.status })</li>
        <li>Title: { this.props.title }</li>
        <li>Date: { this.props.date }</li>
      </ul>
      <div className="event-page__menu">
        <MenuPicker
          items={this.props.menu}
          getMenuList={(list) => { this.menu = [...list]; }}
          withCounters
        />
      </div>
    </div>);
  }
}

Event.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
  menu: PropTypes.arrayOf(Object),
};

const EventContainer = createContainer(({ eventId }) => {
  Meteor.subscribe('Event', eventId);
  Meteor.subscribe('EventMenu', eventId);

  const { name, title, date, status } = Events.findOne() || {};
  const menu = Menu.find().fetch();

  return {
    name,
    title,
    status,
    date,
    menu,
  };
}, Event);

export default EventContainer;
