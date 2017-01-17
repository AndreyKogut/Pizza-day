import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Groups from './collection';
import Events from '../events/collection';
import { notEmpty } from '../checkData';

Meteor.methods({
  'groups.insert': function insert(requestData) {
    const requestDateStructure = Match.Where((data) => {
      try {
        check(data, {
          name: Match.Where(notEmpty),
          description: Match.Maybe(String),
          avatar: Match.Maybe(String),
          members: Match.Maybe([Match.Where(notEmpty)]),
          menu: Match.Maybe([Match.Where(notEmpty)]),
        });
      } catch (err) {
        throw new Meteor.Error(400, `Invalid ${err.path}`);
      }

      return true;
    });

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

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
          name: Match.Maybe(Match.Where(notEmpty)),
          description: Match.Maybe(Match.Where(notEmpty)),
          avatar: Match.Maybe(Match.Where(notEmpty)),
          menu: Match.Maybe([Match.Where(notEmpty)]),
        });
      } catch (err) {
        throw new Meteor.Error(400, `Invalid ${err.path}`);
      }

      return true;
    });

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    check(requestData, requestDataStructure);

    const { id, ...pushData } = requestData;

    const groupCreator = Groups.findOne({ _id: id }).creator;

    if (groupCreator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    Groups.update({ _id: id }, { $set: { ...pushData } });
  },

  'groups.remove': function removeGroup(id) {
    check(id, Match.Where(notEmpty));

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    const groupCreator = Groups.findOne({ _id: id }).creator;

    if (groupCreator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    Groups.remove({ _id: id });
  },

  'groups.addMembers': function addMembers(requestData) {
    const requestDataStructure = Match.Where((data) => {
      check(data, {
        id: Match.Where(notEmpty),
        items: [Match.Where(notEmpty)],
      });

      return true;
    });

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    check(requestData, requestDataStructure);

    const groupCreator = Groups.findOne({ _id: requestData.id }).creator;

    if (groupCreator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    const convertedMembers = _.map(requestData.items, id => ({
      _id: id,
      verified: false,
    }));

    Groups.update({ _id: requestData.id }, { $push: { members: { $each: convertedMembers } } });
  },

  'groups.addMenuItems': function addMenuItems(requestData) {
    const requestDataStructure = Match.Where((data) => {
      check(data, {
        id: Match.Where(notEmpty),
        items: [Match.Where(notEmpty)],
      });

      return true;
    });

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

    check(requestData, requestDataStructure);

    const groupCreator = Groups.findOne({ _id: requestData.id }).creator;

    if (groupCreator !== this.userId) {
      throw new Meteor.Error(403, 'Not owner');
    }

    Groups.update({ _id: requestData.id }, { $push: { menu: { $each: requestData.items } } });
  },

  'groups.removeMember': function removeMember(requestData) {
    const requestDataStructure = Match.Where((data) => {
      check(data, {
        groupId: Match.Where(notEmpty),
        userId: Match.Where(notEmpty),
      });

      return true;
    });

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    if (!Meteor.users.findOne(this.userId).emails[0].verified) {
      throw new Meteor.Error(403, 'Unverified');
    }

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
  'groups.join': function joinGroup(id) {
    check(id, Match.Where(notEmpty));

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

    Groups.update({ _id: id, 'members._id': this.userId }, { $set: { 'members.$.verified': true } });
  },
  'groups.leave': function leaveGroup(id) {
    check(id, Match.Where(notEmpty));

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized');
    }

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
  check(id, Match.Where(notEmpty));

  if (!this.userId) {
    return this.ready();
  }

  return Groups.find(id);
});
