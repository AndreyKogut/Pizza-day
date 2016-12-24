import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Events from './eventsCollection';

Meteor.methods({
  'events.insert': function insert({ name, date, groupId, title = '' }) {
    check(name, String);
    check(title, String);
    check(date, String);
    check(groupId, String);

    const id = new Meteor.Collection.ObjectID.valueOf();

    Events.insert({
      _id: id,
      name,
      title,
      date,
      groupId,
      creator: this.userId,
      createdAt: new Date(),
    });

    return id;
  },
});

Meteor.publish('GroupEvents', (id) => {
  check(id, String);
  return Events.find({ groupId: id });
});

Meteor.publish('Events', function getEvents() {
  check(this.userId, String);
  const groups = Meteor.find({ _id: this.userId }).fetch().groups;

  return Events.find({ groupId: { $in: groups } });
});
