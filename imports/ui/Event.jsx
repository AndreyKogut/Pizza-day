import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Events from '../api/collections/eventsCollection';

class Event extends Component {
  render() {
    return (<div className="event-page">
      <ul>
        <li>Name: { this.props.name }({ this.props.status })</li>
        <li>Title: { this.props.title }</li>
        <li>Date: { this.props.date }</li>
      </ul>
    </div>);
  }
}

Event.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
};

const EventContainer = createContainer(({ eventId }) => {
  Meteor.subscribe('Event', { id: eventId });

  const { name, title, date, status } = Events.findOne() || {};

  return {
    name,
    title,
    status,
    date,
  };
}, Event);

export default EventContainer;
