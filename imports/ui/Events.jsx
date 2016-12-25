import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Events from '../api/eventsCollection';

class EventsList extends Component {

  getEvents() {
    return this.props.events.map(event => (<li key={event._id} className="events__item">
      <a
        href={FlowRouter.path('/groups/:id/events/:eventId', { id: this.props.id, eventId: event._id })}
        className="events__link"
      >
        { event.name }
      </a>
    </li>));
  }

  render() {
    return (<ul className="events">
      { this.getEvents() }
    </ul>);
  }
}

EventsList.propTypes = {
  id: PropTypes.string,
  events: PropTypes.arrayOf(Object),
};

const EventsListContainer = createContainer(({ id }) => {
  Meteor.subscribe('GroupEvents', id);
  const events = Events.find().fetch() || {};

  return {
    id,
    events,
  };
}, EventsList);

export default EventsListContainer;
