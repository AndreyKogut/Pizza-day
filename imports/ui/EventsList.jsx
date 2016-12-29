import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

const propTypes = {
  list: PropTypes.arrayOf(Object),
};

const defaultProps = {
  list: [],
};

function EventsList({ list }) {
  function getEvents() {
    return list.map(event => (<li key={event._id} className="events__item">
      <a
        href={FlowRouter.path('/groups/:id/events/:eventId', { id: event.creator, eventId: event._id })}
        className="events__link"
      >
        { event.name }
      </a>
    </li>));
  }

  return <ul className="events">{ getEvents() }</ul>;
}

EventsList.propTypes = propTypes;
EventsList.defaultProps = defaultProps;

export default EventsList;
