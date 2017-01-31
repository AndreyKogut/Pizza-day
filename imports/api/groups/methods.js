import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Groups from './collection';
import Events from '../events/collection';
import { notEmpty } from '../checkData';
import {
  validateUser,
  isUserGroupOwner,
} from '../permitHelpers';

Meteor.methods({
  'groups.insert': function insert(requestData) {
    const requestDateStructure = Match.Where((data) => {
      try {
        check(data, {
          name: notEmpty(),
          description: Match.Maybe(String),
          avatar: Match.Maybe(String),
          members: Match.Maybe([notEmpty()]),
          menu: Match.Maybe([notEmpty()]),
        });
      } catch (err) {
        throw new Meteor.Error(400, `Invalid ${err.path}`);
      }

      return true;
    });

    validateUser(this.userId);

    check(requestData, requestDateStructure);

    const { members = [], avatar = '/images/group-avatar.png', ...fieldsToInsert } = requestData;

    const convertedMembers = _.map(members, id => ({
      _id: id,
      verified: false,
    }));

    return Groups.insert({
      avatar,
      ...fieldsToInsert,
      members: convertedMembers,
      creator: this.userId,
      createdAt: new Date(),
    });
  },

  'groups.update': function updateGroups(requestData) {
    const requestDataStructure = Match.Where((data) => {
      try {
        check(data, {
          id: String,
          name: Match.Maybe(notEmpty()),
          description: Match.Maybe(notEmpty()),
          avatar: Match.Maybe(notEmpty()),
        });
      } catch (err) {
        throw new Meteor.Error(400, `Invalid ${err.path}`);
      }

      return true;
    });

    validateUser(this.userId);

    check(requestData, requestDataStructure);

    const { id, ...pushData } = requestData;

    isUserGroupOwner(this.userId, id);

    Groups.update({ _id: id }, { $set: { ...pushData } });
  },

  'groups.remove': function removeGroup(id) {
    check(id, notEmpty());

    validateUser(this.userId);

    isUserGroupOwner(this.userId, id);

    Groups.remove({ _id: id });
  },

  'groups.addMembers': function addMembers(requestData) {
    const requestDataStructure = Match.Where((data) => {
      check(data, {
        id: notEmpty(),
        items: [notEmpty()],
      });

      return true;
    });

    validateUser(this.userId);

    check(requestData, requestDataStructure);

    isUserGroupOwner(this.userId, requestData.id);

    const convertedMembers = _.map(requestData.items, id => ({
      _id: id,
      verified: false,
    }));

    Groups.update({ _id: requestData.id }, { $push: { members: { $each: convertedMembers } } });
  },

  'groups.addMenuItems': function addMenuItems(requestData) {
    const requestDataStructure = Match.Where((data) => {
      check(data, {
        id: notEmpty(),
        items: [notEmpty()],
      });

      return true;
    });

    validateUser(this.userId);

    check(requestData, requestDataStructure);

    isUserGroupOwner(this.userId, requestData.id);

    Groups.update({ _id: requestData.id }, { $push: { menu: { $each: requestData.items } } });
  },

  'groups.removeMember': function removeMember(requestData) {
    const requestDataStructure = Match.Where((data) => {
      check(data, {
        groupId: notEmpty(),
        userId: notEmpty(),
      });

      return true;
    });

    validateUser(this.userId);

    check(requestData, requestDataStructure);

    isUserGroupOwner(this.userId, requestData.groupId);

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

  'groups.join': function joinGroup(id) {
    check(id, notEmpty());

    validateUser(this.userId);

    Groups.update({ _id: id, 'members._id': this.userId }, { $set: { 'members.$.verified': true } });
  },

  'groups.leave': function leaveGroup(id) {
    check(id, notEmpty());

    validateUser(this.userId);

    Groups.update({ _id: id },
      { $pull: { members: { _id: this.userId } } });
  },
});

Meteor.publish('Groups', function getGroups() {
  if (!this.userId) {
    return this.ready();
  }

  return Groups.find({ $or: [{ 'members._id': this.userId }, { creator: this.userId }] }, { sort: { createdAt: -1 } });
});

Meteor.publish('Group', function groupPublish(id) {
  check(id, notEmpty());

  if (!this.userId) {
    return this.ready();
  }

  return Groups.find(id);
});
