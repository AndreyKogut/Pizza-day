import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Groups from '../api/groups';

Meteor.publish('Groups', function getGroups() {
  check(this.userId, String);
  return Groups.find({ creator: this.userId });
});

Meteor.publish('Group', (id) => {
  check(id, String);
  return Groups.find(id);
});

Meteor.publish('user', (id) => {
  check(id, String);
  return Meteor.users.find(id);
});
