import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment';
import { eventsSubsManager } from '../../../lib/subsManager';
import Events from '../../../api/events/collection';

const propTypes = {
  items: PropTypes.arrayOf(Object),
  eventsLoading: PropTypes.bool,
};

const defaultProps = {
  items: [],
};

const EventsList = ({ items, eventsLoading }) => {
  if (eventsLoading) {
    return <div className="spinner mdl-spinner mdl-js-spinner is-active" />;
  }

  if (!items.length) {
    return <div className="empty-list" />;
  }

  return (<div className="mdl-grid"> { items.map((event) => {
    const dateTime = moment(event.date).format('L');

    return (<div key={event._id} className="mdl-cell mdl-cell--4-col">
      <div className="event-card mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">{ dateTime }</h2>
          <p className="mdl-card__subtitle-text">{ event.status }</p>
        </div>
        <div className="mdl-card__supporting-text">
          <span className="supporting-text">{ event.title}</span>
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <a
            href={FlowRouter.path('/groups/:id/events/:eventId', { id: event.groupId, eventId: event._id })}
            className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
          >
            { event.name }
          </a>
        </div>
      </div>
    </div>);
  }) }
  </div>);
};

const GroupEventsList = createContainer(({ id }) => {
  const handleEvents = eventsSubsManager.subscribe('GroupEvents', id);

  return {
    items: Events.find({ groupId: id }).fetch(),
    eventsLoading: !handleEvents.ready(),
  };
}, EventsList);

EventsList.propTypes = propTypes;
EventsList.defaultProps = defaultProps;

export default EventsList;
export {
  GroupEventsList,
};
