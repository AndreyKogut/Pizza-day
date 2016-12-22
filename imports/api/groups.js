import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const Groups = new Mongo.Collection('groups');

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

export default Groups;
