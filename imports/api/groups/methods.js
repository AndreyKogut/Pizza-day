import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Groups from './collection';
import { stringList, notEmpty } from '../checkData';

Meteor.methods({
  'groups.insert': function insert(requestData) {
    const requestDateStructure = {
      name: Match.Where(notEmpty),
      description: Match.Maybe(String),
      avatar: Match.Maybe(String),
      members: [String],
      menu: Match.Where(stringList),
    };

    if (!this.userId) {
      throw new Meteor.Error(401, 'You mast be logged in');
    }

    check(requestData, requestDateStructure);

    const id = new Meteor.Collection.ObjectID().valueOf();
    const { members = [], ...fieldsToInsert } = requestData;

    const convertedMembers = [{
      _id: this.userId,
      verified: true,
    }];

    members.map(item => convertedMembers.push({
      _id: item,
      verified: false,
    }));

    Groups.insert({
      _id: id,
      ...fieldsToInsert,
      members: convertedMembers,
      creator: this.userId,
      createdAt: new Date(),
    });

    return id;
  },

  'groups.update': function updateGroups(requestData) {
    const requestDataStructure = {
      id: String,
      name: Match.Maybe(String),
      description: Match.Maybe(String),
      avatar: Match.Maybe(String),
      menu: Match.Maybe([String]),
      members: Match.Maybe([Object]),
    };

    check(requestData, requestDataStructure);

    const groupCreator = Groups.findOne({ _id: requestData.id }).creator;

    if (groupCreator !== this.userId) {
      throw new Meteor.Error(402, 'You must be creator');
    }

    const updateData = _.pick(requestData, value => value);

    Groups.update({ _id: requestData.id }, updateData);
  },

  'groups.remove': function removeGroup(id) {
    check(id, String);

    const groupCreator = Groups.findOne({ _id: id }).creator;

    if (groupCreator !== this.userId) {
      throw new Meteor.Error(402, 'You must be creator');
    }

    Groups.remove({ _id: id });
  },
});

Meteor.publish('Groups', function getGroups() {
  if (!this.userId) {
    return this.error(new Meteor.Error(401, 'Access denied'));
  }

  return Groups.find({ 'members._id': this.userId }, { sort: { createdAt: -1 } });
});

Meteor.publish('Group', function groupPublish(id) {
  check(id, Match.Where(notEmpty));

  if (!this.userId) {
    return this.error(new Meteor.Error(401, 'Access denied'));
  }

  return Groups.find(id);
});
