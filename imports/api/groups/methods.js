import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Groups from './collection';
import Events from '../events/collection';
import { notEmpty } from '../checkData';

Meteor.methods({
  'groups.insert': function insert(requestData) {
    const requestDateStructure = {
      name: Match.Where(notEmpty),
      description: Match.Maybe(String),
      avatar: Match.Maybe(String),
      members: Match.Maybe([Match.Where(notEmpty)]),
      menu: Match.Maybe([Match.Where(notEmpty)]),
    };

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    check(requestData, requestDateStructure);

    const { members = [], ...fieldsToInsert } = requestData;

    const convertedMembers = [{
      _id: this.userId,
      verified: true,
    }];

    members.map(item => convertedMembers.push({
      _id: item,
      verified: false,
    }));

    return Groups.insert({
      ...fieldsToInsert,
      members: convertedMembers,
      creator: this.userId,
      createdAt: new Date(),
    });
  },

  'groups.update': function updateGroups(requestData) {
    const requestDataStructure = {
      id: String,
      name: Match.Maybe(String),
      description: Match.Maybe(String),
      avatar: Match.Maybe(String),
      menu: Match.Maybe([Match.Where(notEmpty)]),
    };

    check(requestData, requestDataStructure);

    const { id, ...pushData } = requestData;

    const groupCreator = Groups.findOne({ _id: requestData.id }).creator;

    if (groupCreator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    const pushNotEmptyData = _.pick(pushData, value => value);

    if (!_.isEmpty(pushNotEmptyData)) {
      Groups.update({ _id: id }, { $set: { ...pushNotEmptyData } });
    }
  },

  'groups.remove': function removeGroup(id) {
    check(id, Match.Where(notEmpty));

    const groupCreator = Groups.findOne({ _id: id }).creator;

    if (groupCreator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    Groups.remove({ _id: id });
  },

  'groups.addMembers': function addMembers(requestData) {
    const requestDataStructure = {
      id: Match.Where(notEmpty),
      items: [Match.Where(notEmpty)],
    };

    check(requestData, requestDataStructure);

    const groupCreator = Groups.findOne({ _id: requestData.id }).creator;

    if (groupCreator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    const convertedMembers = [];

    requestData.items.map(item => convertedMembers.push({
      _id: item,
      verified: false,
    }));

    Groups.update({ _id: requestData.id }, { $push: { members: { $each: convertedMembers } } });
  },

  'groups.addMenuItems': function addMenuItems(requestData) {
    const requestDataStructure = {
      id: Match.Where(notEmpty),
      items: [Match.Where(notEmpty)],
    };

    check(requestData, requestDataStructure);

    const groupCreator = Groups.findOne({ _id: requestData.id }).creator;

    if (groupCreator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    Groups.update({ _id: requestData.id }, { $push: { menu: { $each: requestData.items } } });
  },

  'groups.removeMember': function removeMember(requestData) {
    const requestDataStructure = {
      groupId: Match.Where(notEmpty),
      userId: Match.Where(notEmpty),
    };

    check(requestData, requestDataStructure);

    const groupCreator = Groups.findOne({ _id: requestData.groupId }).creator;

    if (groupCreator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    Groups.update(
      { _id: requestData.groupId },
      { $pull: { members: { _id: requestData.userId } } },
      );

    Events.update({
      groupId: requestData.groupId,
      'participants._id': requestData.userId,
    }, {
      $pull: {
        participants: {
          _id: requestData.userId,
        },
      },
    }, {
      multi: true,
    });
  },
});

Meteor.publish('Groups', function getGroups() {
  if (!this.userId) {
    return this.ready();
  }

  return Groups.find({ $or: [{ 'members._id': this.userId }, { creator: this.userId }] }, { sort: { createdAt: -1 } });
});

Meteor.publish('Group', function groupPublish(id) {
  check(id, Match.Where(notEmpty));

  if (!this.userId) {
    return this.ready();
  }

  return Groups.find(id);
});
