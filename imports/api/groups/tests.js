/* eslint-disable func-names, prefer-arrow-callback */
/* eslint-disable no-unused-expressions */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect, should } from 'meteor/practicalmeteor:chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './methods';

describe('Groups collection/methods testing', function () {
  after(function () {
    resetDatabase();
  });

  describe('Creating group', function () {
    beforeEach(function () {
      resetDatabase();
    });

    it('Get unauthorized if creating group not logged in', function () {
      const group = Factory.tree('group');

      return expect(
        () => Meteor.call('groups.insert', group),
      ).to.throw('Unauthorized');
    });

    it('Get unverified if creating group without email verification', function () {
      const unverifiedEmail = Factory.tree('email', { verified: false });
      const user = Factory.create('users', { emails: [unverifiedEmail] });

      return expect(
        () => Meteor.server.method_handlers['groups.insert'].call({ userId: user._id }, {}),
      ).to.throw('Unverified');
    });

    it('Get invalid name creating group with empty name', function () {
      const group = Factory.tree('group', { name: '' });
      const user = Factory.create('users');

      return expect(
        () => Meteor.server.method_handlers['groups.insert'].call({ userId: user._id }, group),
      ).to.throw('Invalid name');
    });
  });

  describe('Groups methods', function () {
    describe('Get unauthorized using methods when not signed in', function () {
      it('Update group', function () {
        return expect(
          () => Meteor.call('groups.update'),
        ).to.throw('Unauthorized');
      });

      it('Remove group', function () {
        return expect(
          () => Meteor.call('groups.remove', 'id'),
        ).to.throw('Unauthorized');
      });

      it('Add members to group', function () {
        return expect(
          () => Meteor.call('groups.addMembers'),
        ).to.throw('Unauthorized');
      });

      it('Add menu items to group', function () {
        return expect(
          () => Meteor.call('groups.addMenuItems'),
        ).to.throw('Unauthorized');
      });

      it('Remove member from group', function () {
        return expect(
          () => Meteor.call('groups.removeMember'),
        ).to.throw('Unauthorized');
      });

      it('Join group', function () {
        return expect(
          () => Meteor.call('groups.join', 'id'),
        ).to.throw('Unauthorized');
      });

      it('Leave group', function () {
        return expect(
          () => Meteor.call('groups.leave', 'id'),
        ).to.throw('Unauthorized');
      });
    });

    describe('Get unverified using methods when email is not verified', function () {
      let userId = null;

      before(function () {
        resetDatabase();
        const unverifiedEmail = Factory.build('email', { verified: false });
        const user = Factory.create('users', { emails: [unverifiedEmail] });
        userId = user._id;
      });

      it('Update group', function () {
        return expect(
          () => Meteor.server.method_handlers['groups.update'].call({ userId }, {}),
        ).to.throw('Unverified');
      });

      it('Remove group', function () {
        return expect(
          () => Meteor.server.method_handlers['groups.remove'].call({ userId }, 'id'),
        ).to.throw('Unverified');
      });

      it('Add members to group', function () {
        return expect(
          () => Meteor.server.method_handlers['groups.addMembers'].call({ userId }),
        ).to.throw('Unverified');
      });

      it('Add menu items to group', function () {
        return expect(
          () => Meteor.server.method_handlers['groups.addMenuItems'].call({ userId }),
        ).to.throw('Unverified');
      });

      it('Remove member from group', function () {
        return expect(
          () => Meteor.server.method_handlers['groups.removeMember'].call({ userId }),
        ).to.throw('Unverified');
      });

      it('Join group', function () {
        return expect(
          () => Meteor.server.method_handlers['groups.join'].call({ userId }, 'id'),
        ).to.throw('Unverified');
      });

      it('Leave group', function () {
        return expect(
          () => Meteor.server.method_handlers['groups.leave'].call({ userId }, 'id'),
        ).to.throw('Unverified');
      });
    });

    describe('Get not owned when you don\'t own group', function () {
      let userId = null;
      let groupId = null;

      before(function () {
        resetDatabase();
        const user = Factory.create('users');
        userId = user._id;
        const group = Factory.create('groups');
        groupId = group._id;
      });

      it('Update group', function () {
        return expect(
          () => Meteor.server.method_handlers['groups.update'].call({ userId }, { id: groupId }),
        ).to.throw('Not owner');
      });

      it('Remove group', function () {
        return expect(
          () => Meteor.server.method_handlers['groups.remove'].call({ userId }, groupId),
        ).to.throw('Not owner');
      });

      it('Add members to group', function () {
        return expect(
          () => Meteor.server.method_handlers['groups.addMembers'].call({ userId }, { id: groupId, items: [] }),
        ).to.throw('Not owner');
      });

      it('Add menu items to group', function () {
        return expect(
          () => Meteor.server.method_handlers['groups.addMenuItems'].call({ userId }, { id: groupId, items: [] }),
        ).to.throw('Not owner');
      });

      it('Remove member from group', function () {
        return expect(
          () => Meteor.server.method_handlers['groups.removeMember'].call({ userId }, { groupId, userId }),
        ).to.throw('Not owner');
      });
    });

    describe('Methods for group creator', function () {
      let userId = null;
      let groupId = null;
      before(function () {
        resetDatabase();
        const user = Factory.create('users');
        userId = user._id;
        const group = Factory.create('groups', { creator: userId });
        groupId = group._id;
      });

      it('Add members to group', function () {
        return Meteor.server.method_handlers['groups.addMembers']
          .call({ userId }, { id: groupId, items: ['id'] });
      });

      it('Add menu items to group', function () {
        return Meteor.server.method_handlers['groups.addMenuItems']
          .call({ userId }, { id: groupId, items: ['id'] });
      });

      it('Remove member from group', function () {
        return Meteor.server.method_handlers['groups.removeMember']
          .call({ userId }, { groupId, userId });
      });

      it('Remove group', function () {
        return Meteor.server.method_handlers['groups.remove']
          .call({ userId }, groupId);
      });

      describe('Update group fields', function () {
        before(function () {
          const group = Factory.create('groups', { creator: userId });
          groupId = group._id;
        });

        it('Got error with empty object', function () {
          return expect(
            () => Meteor.server.method_handlers['groups.update']
              .call({ userId }, { id: groupId }),
          ).to.throw();
        });

        it('Update name', function () {
          return Meteor.server.method_handlers['groups.update']
            .call({ userId }, { id: groupId, name: 'new' });
        });

        it('Update description', function () {
          return Meteor.server.method_handlers['groups.update']
            .call({ userId }, { id: groupId, description: 'new' });
        });

        it('Update avatar', function () {
          return Meteor.server.method_handlers['groups.update']
            .call({ userId }, { id: groupId, avatar: 'new' });
        });
      });
    });
  });

  describe('Groups publications', function () {
    const userId = 'id';
    let insertedGroups = null;

    describe('For unauthorized user', function () {
      before(function () {
        resetDatabase();
        insertedGroups = _.times(3, () => Factory.create('groups'));
      });

      it('Group publication return empty cursor', function () {
        const collector = new PublicationCollector();

        return collector.collect('Group', insertedGroups[0]._id, (collections) => {
          should().not.exist(collections.groups);
        });
      });

      it('Groups publication return empty cursor', function () {
        const collector = new PublicationCollector();

        return collector.collect('Groups', insertedGroups[0]._id, (collections) => {
          should().not.exist(collections.groups);
        });
      });
    });

    describe('For authorized user', function () {
      before(function () {
        resetDatabase();
        insertedGroups = _.times(3, () => Factory.create('groups'));
      });

      it('Group publication return empty cursor', function () {
        const collector = new PublicationCollector({ userId });

        return collector.collect('Group', insertedGroups[0]._id, (collections) => {
          expect(collections.groups).have.lengthOf(1);
        });
      });

      it('Groups publication return empty cursor', function () {
        const collector = new PublicationCollector({ userId });

        return collector.collect('Groups', {}, (collections) => {
          expect(collections.groups).have.lengthOf(0);
        });
      });
    });

    describe('For authorized user if member of each group', function () {
      before(function () {
        resetDatabase();
        const verifiedMember = Factory.build('member', { _id: userId });
        insertedGroups = _.times(3, () => Factory.create('groups', { members: [verifiedMember] }));
      });

      it('Groups publication return 3 items', function () {
        const collector = new PublicationCollector({ userId });

        return collector.collect('Groups', {}, (collections) => {
          expect(collections.groups).have.lengthOf(3);
        });
      });
    });

    describe('For authorized user if creator of each group', function () {
      before(function () {
        resetDatabase();
        insertedGroups = _.times(3, () => Factory.create('groups', { creator: userId }));
      });

      it('Groups publication return 3 items', function () {
        const collector = new PublicationCollector({ userId });

        return collector.collect('Groups', {}, (collections) => {
          expect(collections.groups).have.lengthOf(3);
        });
      });
    });
  });
});
