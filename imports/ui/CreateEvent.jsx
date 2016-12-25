import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.createEvent = this.createEvent.bind(this);
  }

  createEvent(event) {
    event.preventDefault();

    const name = this.name.value.trim();
    const title = this.title.value.trim();
    const date = this.date.value;
    const groupId = this.props.id;

    Meteor.call(
      'events.insert',
      { name, title, date, groupId },
      this.handleMethodsCallbacks(this.successLoginCallback),
    );
  }

  successLoginCallback = (id) => {
    FlowRouter.go('/groups/:id/events/:eventId', { id, eventId: this.props.id });
  };

  handleMethodsCallbacks =
    (handledFunction = () => {}) =>
      (err, res) => {
        if (err) {
          switch (err.error) {
            case 500: {
              console.log('Service unavailable');
              break;
            }
            default: {
              console.log(err);
            }
          }
        } else {
          handledFunction(res);
        }
      };

  render() {
    return (<form onSubmit={this.createEvent} className="form event-create">
      <ul className="event-create__list">
        <li className="event-create__item">
          <label className="form__label" htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            ref={(name) => { this.name = name; }}
            id="name"
            className="form__input"
          />
        </li>
        <li className="event-create__item">
          <label className="form__label" htmlFor="title">
            Title:
          </label>
          <textarea
            ref={(title) => { this.title = title; }}
            id="title"
            className="form__textarea"
          />
        </li>
        <li className="event-create__item">
          <label htmlFor="date" className="event-create__label">
            Date:
          </label>
          <input
            type="date"
            ref={(date) => { this.date = date; }}
            className="event-create__input"
          />
        </li>
        <li className="event-create__item">
          <input type="submit" value="Create event" />
        </li>
      </ul>
    </form>);
  }
}

CreateEvent.propTypes = {
  id: PropTypes.string,
};

export default CreateEvent;

