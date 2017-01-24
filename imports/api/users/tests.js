/* eslint-disable func-names, prefer-arrow-callback */
/* eslint-disable no-unused-expressions */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { stubs } from 'meteor/practicalmeteor:sinon';
import { expect, should } from 'meteor/practicalmeteor:chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import Groups from '../groups/collection';
import Events from '../events/collection';
import './methods';

describe('Users collection/methods testing', function () {
  after(function () {
    resetDatabase();
  });

  describe('Creating user', function () {
    it('Creating user with full info', function () {
      const user = Factory.tree('user');

      return Meteor.call('user.insert', user);
    });

    it('Get error creating user with empty object', function () {
      return expect(
        () => Meteor.call('user.insert', {}),
      ).to.throw();
    });

    it('Get error creating user without name', function () {
      const user = Factory.tree('user', { name: '' });

      return expect(
        () => Meteor.call('user.insert', user),
        ).to.throw('Invalid name');
    });
  });

  describe('Updating user', function () {
    it('Update unauthorized user got unauthorized', function () {
      return expect(
          () => Meteor.call('user.update', {}),
        ).to.throw('Unauthorized');
    });

    it('Update unverified user got unverified', function () {
      const unverifiedEmail = Factory.tree('email', { verified: false });
      const user = Factory.create('users', { emails: [unverifiedEmail] });

      return expect(
          () => Meteor.server.method_handlers['user.update'].call({ userId: user._id }, {}),
        ).to.throw('Unverified');
    });

    describe('Signed and verified user updates', function () {
      let userId = null;

      before(function () {
        resetDatabase();
        const user = Factory.create('users');
        userId = user._id;
      });

      it('Update user with empty object got error', function () {
        return expect(
            () => Meteor.server.method_handlers['user.update'].call({ userId }, {}),
        ).to.throw();
      });

      it('Update user profile name', function () {
        return Meteor.server.method_handlers['user.update'].call({ userId }, { name: 'New' });
      });

      it('Update user profile company', function () {
        return Meteor.server.method_handlers['user.update'].call({ userId }, { company: 'New' });
      });

      it('Update user profile position', function () {
        return Meteor.server.method_handlers['user.update'].call({ userId }, { position: 'New' });
      });

      it('Update user profile about', function () {
        return Meteor.server.method_handlers['user.update'].call({ userId }, { about: 'New' });
      });

      it('Update user profile avatar', function () {
        return Meteor.server.method_handlers['user.update'].call({ userId }, { avatar: 'New' });
      });
    });
  });

  describe('Users publications', function () {
    describe('Users publications for not registered user', function () {
      let insertedUsers;
      before(function () {
        resetDatabase();
        insertedUsers = _.times(3, () => Factory.create('users'));
      });

      it('User publication return empty cursor', function () {
        const collector = new PublicationCollector();

        return collector.collect('User', insertedUsers[0]._id, (collections) => {
          should().not.exist(collections.users);
        });
      });

      it('UsersList publication return empty cursor', function () {
        const collector = new PublicationCollector();

        return collector.collect('UsersList', {}, (collections) => {
          should().not.exist(collections.users);
        });
      });

      it('UsersListFilter publication return empty cursor', function () {
        const collector = new PublicationCollector();

        return collector.collect('UsersListFilter', {}, (collections) => {
          should().not.exist(collections.users);
        });
      });

      it('GroupMembers publication return empty cursor', function () {
        const collector = new PublicationCollector();

        return collector.collect('GroupMembers', 'id', (collections) => {
          should().not.exist(collections.users);
        });
      });

      it('EventParticipant publication return empty cursor', function () {
        const collector = new PublicationCollector();

        return collector.collect('EventParticipant', 'id', (collections) => {
          should().not.exist(collections.users);
        });
      });
    });

    describe('Users publications for signed user', function () {
      let insertedUsers;

      before(function () {
        resetDatabase();
        insertedUsers = _.times(3, () => Factory.create('users'));

        const participants = _.times(3, i => Factory.build('participant', { _id: insertedUsers[i]._id }));
        stubs.create('eventFind', Events, 'findOne');
        stubs.eventFind.returns({ participants });

        const members = _.times(3, i => Factory.build('member', { _id: insertedUsers[i]._id }));
        stubs.create('groupFind', Groups, 'findOne');
        stubs.groupFind.returns({ members });
      });

      after(function () {
        stubs.restoreAll();
      });

      it('User publication return user', function () {
        const collector = new PublicationCollector({ userId: insertedUsers[0]._id });

        return collector.collect('User', insertedUsers[0]._id, (collections) => {
          expect(collections.users).to.have.lengthOf(1);
        });
      });

      it('UsersList publication return 2/3 users', function () {
        const collector = new PublicationCollector({ userId: insertedUsers[0]._id });

        return collector.collect('UsersList', {}, (collections) => {
          expect(collections.users).to.have.lengthOf(2);
        });
      });

      it('UsersListFilter publication return user number 2 when filter match his name', function () {
        const collector = new PublicationCollector({ userId: insertedUsers[0]._id });

        const filter = {
          filter: {
            email: insertedUsers[1].emails[0].address,
            name: '',
          },
          limiter: 3,
        };

        return collector.collect('UsersListFilter', filter, (collections) => {
          expect(collections.users).to.have.lengthOf(1);
        });
      });

      it('GroupMembers publication return 3/3 users', function () {
        const collector = new PublicationCollector({ userId: insertedUsers[0]._id });

        return collector.collect('GroupMembers', 'id', (collections) => {
          expect(collections.users).to.have.lengthOf(3);
        });
      });

      it('EventParticipant publication return 3/3 users', function () {
        const collector = new PublicationCollector({ userId: insertedUsers[0]._id });

        return collector.collect('EventParticipant', 'id', (collections) => {
          expect(collections.users).to.have.lengthOf(3);
        });
      });
    });
  });
});
