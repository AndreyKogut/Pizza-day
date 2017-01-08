import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Events from '../../api/events/collection';

const propTypes = {
  items: PropTypes.arrayOf(Object),
  eventsLoading: PropTypes.bool,
};

const defaultProps = {
  items: [],
};

const EventsList = ({ items, eventsLoading }) => {
  if (eventsLoading) {
    return <div>Loading...</div>;
  }

  return (<ul className="events"> { items.map(event => (<li key={event._id} className="events__item">
    <a
      href={FlowRouter.path('/groups/:id/events/:eventId', { id: event.groupId, eventId: event._id })}
      className="events__link"
    >
      { event.name }
    </a>
  </li>)) } </ul>);
};

const GroupEventsList = createContainer(({ id }) => {
  const handleEvents = Meteor.subscribe('GroupEvents', id);

  return {
    items: Events.find().fetch(),
    eventsLoading: !handleEvents.ready(),
  };
}, EventsList);

EventsList.propTypes = propTypes;
EventsList.defaultProps = defaultProps;

export default EventsList;
export {
  GroupEventsList,
};
