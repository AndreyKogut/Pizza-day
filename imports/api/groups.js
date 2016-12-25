import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Groups from './collections/groupsCollection';

Meteor.methods({
  'group.insert': function insert({ name, description = '', avatar = '', members = [], events = [], menu }) {
    check(name, String);
    check(description, String);
    check(members, Array);
    check(events, Array);
    check(avatar, String);

    members.push(this.userId);
    const id = new Meteor.Collection.ObjectID().valueOf();

    Groups.insert({
      _id: id,
      name,
      description,
      creator: this.userId,
      avatar,
      members,
      events,
      menu,
      createdAt: new Date(),
    });

    return id;
  },
});

Meteor.publish('Groups', function getGroups() {
  check(this.userId, String);
  return Groups.find({ members: this.userId });
});

Meteor.publish('Group', (id) => {
  check(id, String);
  return Groups.find(id);
});
