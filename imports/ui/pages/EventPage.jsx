import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import { eventsSubsManager } from '../../lib/subsManager';
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
  const formattedDate = moment(props.date).format('LLL');

  function updateData(obj) {
    Meteor.call('events.update',
      { id: props.eventId, ...obj },
      handleMethodsCallbacks(),
    );
  }

  function joinEvent() {
    Meteor.call('events.joinEvent', props.eventId, handleMethodsCallbacks());
  }

  function leaveEvent() {
    Meteor.call('events.leaveEvent', props.eventId, handleMethodsCallbacks());
  }

  function orderItems() {
    const menu = this.menu || [];
    const eventId = props.eventId;

    Meteor.call('orders.insert', { eventId, menu }, handleMethodsCallbacks());
  }

  function deleteOrder() {
    const eventId = props.eventId;

    Meteor.call('events.removeOrdering', eventId, handleMethodsCallbacks());
  }

  function addMenuItems(items) {
    const eventId = props.eventId;

    Meteor.call('events.addMenuItems', { id: eventId, items });
  }

  function changeStatus(event) {
    Meteor.call('events.updateStatus', {
      id: props.eventId,
      status: event.target.value,
    });
  }

  function enterData(func) {
    return (event) => {
      if (event.key.toLowerCase() === 'enter') {
        func();
      }

      return true;
    };
  }

  if (props.eventLoading) {
    return <div>Loading event...</div>;
  }

  return (<div className="content page-content">
    <div className="mdl-grid">
      <div className="mdl-cell mdl-cell--6-col">
        <h2>{ props.name }
          { editable && <div className="correct-indent mdl-textfield mdl-js-textfield mdl-textfield--expandable">
            <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="name">
              <i className="material-icons">edit</i>
            </label>
            <div className="mdl-textfield__expandable-holder">
              <input
                type="text"
                ref={(name) => {
                  this.eventName = name;
                }}
                id="name"
                onKeyPress={enterData(() => {
                  updateData({ name: this.eventName.value });
                  this.eventName.value = '';
                })}
                className="mdl-textfield__input"
              />
              <label className="mdl-textfield__label" htmlFor="name">New name</label>
            </div>
          </div> }
        </h2>
      </div>
      <div className="mdl-layout-spacer" />
      <div>
        <div className="controls">
          { editable ? <select
            className="status-select mdl-button"
            value={props.status}
            onChange={changeStatus}
          >
            <option
              value="ordering"
            >ordering</option>
            <option
              value="ordered"
            >ordered</option>
            <option
              value="delivering"
            >delivering</option>
            <option
              value="delivered"
            >delivered</option>
          </select> : <span className="event-status">{ props.status }</span> }
          { props.isParticipant ?
            <button
              type="button"
              id="leave-event"
              className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--accent"
              onClick={leaveEvent}
            >
              <i className="material-icons">not_interested</i>
              <div className="mdl-tooltip" data-mdl-for="leave-event">
                Leave event
              </div>
            </button> :
            <button
              type="button"
              id="join-event"
              className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--accent"
              onClick={joinEvent}
            >
              <div className="mdl-tooltip" data-mdl-for="join-event">
                Join event
              </div>
              <i className="material-icons">add_circle_outline</i>
            </button> }
          { editable && <Controls
            updateData={(date) => { updateData({ date }); }}
            eventId={props.eventId}
            controls={{ menu: true, date: true }}
            menu={props.menu}
            addMenuItems={(items) => { addMenuItems(items); }}
          /> }
        </div>
      </div>
    </div>
    <div className="mdl-grid">
      <div className="mdl-cell mdl-cell--6-col">
        <span className="as-b">{ props.title }
          { editable && <div className="correct-indent mdl-textfield mdl-js-textfield mdl-textfield--expandable">
            <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="title">
              <i className="material-icons">edit</i>
            </label>
            <div className="mdl-textfield__expandable-holder">
              <input
                type="text"
                ref={(name) => {
                  this.title = name;
                }}
                id="title"
                onKeyPress={enterData(() => {
                  updateData({ title: this.title.value });
                  this.title.value = '';
                })}
                className="mdl-textfield__input"
              />
              <label className="mdl-textfield__label" htmlFor="title">New title</label>
            </div>
          </div> }
        </span>
      </div>
      <div className="mdl-layout-spacer" />
      <h5 className="as-b headline">{ formattedDate }</h5>
    </div>
    { props.orderId ?
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--6-col">
          <h4>Order</h4>
        </div>
        <div className="mdl-layout-spacer" />
        <button
          className="as-c mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
          type="button"
          onClick={deleteOrder}
        >Delete ordering</button>
      </div> : <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--6-col">
          <h4>Menu</h4>
        </div>
        <div className="mdl-layout-spacer" />
        <button
          className="as-c mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
          type="button"
          onClick={orderItems}
        >Order items</button>
      </div> }
    { props.orderId ?
      <OrderInfoContainer
        id={props.orderId}
      /> :
      <OrderMenuPicker
        id={props.eventId}
        key={props.menu}
        showItems={props.menu}
        getMenuList={(list) => { this.menu = [...list]; }}
      /> }
  </div>);
};

EventPage.propTypes = propTypes;
EventPage.defaultProps = defaultProps;

const EventPageContainer = createContainer(({ eventId }) => {
  const handleEvent = eventsSubsManager.subscribe('Event', eventId);

  const event = Events.findOne(eventId) || {};

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
