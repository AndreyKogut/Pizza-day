import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Events from './collections/eventsCollection';
import Groups from './collections/groupsCollection';

Meteor.methods({
  'events.insert': function insert({ name, date, groupId, title = '' }) {
    check(name, String);
    check(title, String);
    check(date, String);
    check(groupId, String);

    const groupCreatorId = Groups.findOne({ _id: groupId }).creator;

    if (groupCreatorId !== this.userId) {
      throw new Meteor.Error(403, 'Access denied');
    }

    const id = new Meteor.Collection.ObjectID().valueOf();

    Events.insert({
      _id: id,
      name,
      title,
      date,
      groupId,
      participants: [],
      status: 'ordering',
      creator: this.userId,
      createdAt: new Date(),
    });

    return id;
  },
  'events.joinEvent': function addParticipant({ eventId }) {
    check(eventId, String);

    Events.upsert({ _id: eventId }, { $push: { _id: this.userId, ordered: false } });
  },
  'events.leave': function deleteParticipant({ eventId }) {
    check(eventId, String);

    Events.update({ _id: eventId }, { $pull: { _id: this.userId } });
  },
});

Meteor.publish('GroupEvents', (id) => {
  check(id, String);

  return Events.find({ groupId: id });
});

Meteor.publish('Events', function getEvents() {
  check(this.userId, String);

  return Events.find({ 'participants._id': this.userId });
});

Meteor.publish('Event', ({ id }) => {
  check(id, String);

  return Events.find({ _id: id });
});
