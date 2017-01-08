import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import handleMethodsCallbacks from '../../helpers/handleMethodsCallbacks';
import { OrderMenuPicker } from '../components/MenuPicker';
import { OrderInfoContainer } from '../components/OrderInfo';
import Events from '../../api/events/collection';
import Controls from '../../ui/components/Controls';

const propTypes = {
  eventId: PropTypes.string,
  creator: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  menu: PropTypes.arrayOf(String),
  status: PropTypes.string,
  orderId: PropTypes.string,
  isParticipant: PropTypes.bool,
  eventLoading: PropTypes.bool,
};

const defaultProps = {
  orderedItems: [],
};

const EventPage = (props) => {
  const editable = props.creator === Meteor.userId();

  function updateData(obj) {
    Meteor.call('events.update',
      { id: props.eventId, ...obj },
      handleMethodsCallbacks,
    );
  }

  function joinEvent() {
    Meteor.call('events.joinEvent', props.eventId, handleMethodsCallbacks);
  }

  function leaveEvent() {
    Meteor.call('events.leaveEvent', props.eventId, handleMethodsCallbacks);
  }

  function orderItems() {
    const menu = this.menu || [];
    const eventId = props.eventId;

    Meteor.call('orders.insert', { eventId, menu }, handleMethodsCallbacks);
  }

  function deleteOrder() {
    const eventId = props.eventId;

    Meteor.call('events.removeOrdering', eventId, handleMethodsCallbacks);
  }

  function addMenuItems(items) {
    const eventId = props.eventId;

    Meteor.call('events.addMenuItems', { id: eventId, items });
  }

  function deliverEvent() {
    Meteor.call('events.deliverEvent', props.eventId);
  }

  function changeStatus(event) {
    Meteor.call('events.updateStatus', {
      id: props.eventId,
      status: event.target.value,
    });
  }

  if (props.eventLoading) {
    return <div>Loading event...</div>;
  }

  return (<div className="event-page">
    { editable ?
      <div className="groups__controls">
        <button
          type="button"
          onClick={deliverEvent}
        >Deliver items</button>
        <Controls
          updateData={(date) => { updateData({ date }); }}
          eventId={props.eventId}
          controls={{ menu: true, date: true }}
          menu={props.menu}
          addMenuItems={(items) => { addMenuItems(items); }}
        />
      </div> : '' }
    <div className="event-page__info">
      <div>
        <label htmlFor={props.name}>Name : </label>
        <input
          type="text"
          ref={(name) => { this.eventName = name; }}
          defaultValue={props.name}
          placeholder="No name"
          readOnly={!editable}
          id={props.name}
          onChange={() => { updateData({ name: this.eventName.value }); }}
          className={!editable ? 'clear-defaults' : ''}
        />
        ({ editable ? <select
          defaultValue={props.status}
          onChange={changeStatus}
        >
          <option value="ordering">ordering</option>
          <option value="ordered">ordered</option>
          <option value="delivering">delivering</option>
          <option value="delivered">delivered</option>
        </select> : props.status })
      </div>
      <div><label htmlFor={props.title}>Title : </label>
        <input
          type="text"
          ref={(title) => { this.title = title; }}
          defaultValue={props.title}
          placeholder="No name"
          readOnly={!editable}
          id={props.title}
          onChange={() => { updateData({ title: this.title.value }); }}
          className={!editable ? 'clear-defaults' : ''}
        /></div>
      <div>Date: { props.date }</div>
      <div>
        { props.isParticipant ?
          <button type="button" onClick={leaveEvent}>Leave</button> :
          <button type="button" onClick={joinEvent}>Join</button> }
      </div>
    </div>
    <div className="event-page__menu">
      { props.orderId ?
        <OrderInfoContainer
          id={props.orderId}
        /> :
        <OrderMenuPicker
          id={props.eventId}
          key={props.menu}
          getMenuList={(list) => { this.menu = [...list]; }}
        /> }
    </div>
    { props.orderId ?
      <button type="button" onClick={deleteOrder}>Delete ordering</button> :
      <button type="button" onClick={orderItems}>Order items</button> }
  </div>);
};

EventPage.propTypes = propTypes;
EventPage.defaultProps = defaultProps;

const EventPageContainer = createContainer(({ eventId }) => {
  const handleEvent = Meteor.subscribe('Event', eventId);

  const event = Events.findOne() || {};
  const participant = _.findWhere(event.participants, { _id: Meteor.userId() });

  return {
    eventId,
    orderId: participant ? participant.order : null,
    ...event,
    isParticipant: !!participant,
    eventLoading: !handleEvent.ready(),
  };
}, EventPage);

export default EventPageContainer;
