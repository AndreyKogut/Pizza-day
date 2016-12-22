import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Groups from './groupsCollection';

Meteor.methods({
  'group.insert': function insert({ name, description = '', avatar, creator, members = [], events = [] }) {
    check(name, String);
    check(description, String);
    check(creator, String);
    check(members, Array);
    check(events, Array);
    check(avatar, String);

    Groups.insert({
      _id: new Meteor.Collection.ObjectID().valueOf(),
      name,
      description,
      creator,
      avatar,
      members,
      events,
      createdAt: new Date(),
    });
  },
});

Meteor.publish('Groups', function getGroups() {
  check(this.userId, String);
  return Groups.find({ creator: this.userId });
});

Meteor.publish('Group', (id) => {
  check(id, String);
  return Groups.find(id);
});
