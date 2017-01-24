/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect, should } from 'meteor/practicalmeteor:chai';
import faker from 'faker';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './methods';

describe('Events collection/methods testing', function () {
  after(function () {
    resetDatabase();
  });

  describe('Creating event', function () {
    it('Get unauthorized if creating event not logged in', function () {
      const event = Factory.tree('event');

      return expect(
        () => Meteor.call('events.insert', event),
      ).to.throw('Unauthorized');
    });

    it('Get unverified if creating event without email verification', function () {
      const unverifiedEmail = Factory.tree('email', { verified: false });
      const user = Factory.create('users', { emails: [unverifiedEmail] });

      return expect(
        () => Meteor.server.method_handlers['events.insert'].call({ userId: user._id }, {}),
      ).to.throw('Unverified');
    });

    describe('Creating event for authorized and verified user', function () {
      let userId = null;
      let ownedGroupId = null;
      let groupId = null;

      before(function () {
        const user = Factory.create('users');
        userId = user._id;
        const ownedGroup = Factory.create('groups', { creator: userId });
        ownedGroupId = ownedGroup._id;
        const group = Factory.create('groups');
        groupId = group._id;
      });

      it('Get invalid name creating event with empty name', function () {
        const event = Factory.tree('event', { groupId, name: '' });

        return expect(
          () => Meteor.server.method_handlers['events.insert'].call({ userId }, event),
        ).to.throw('Invalid name');
      });

      it('Get invalid groupId creating event with empty groupId', function () {
        const event = Factory.tree('event', { groupId: '' });

        return expect(
          () => Meteor.server.method_handlers['events.insert'].call({ userId }, event),
        ).to.throw('Invalid groupId');
      });

      it('Get invalid date creating event with empty date', function () {
        const event = Factory.tree('event', { groupId, date: '' });

        return expect(
          () => Meteor.server.method_handlers['events.insert'].call({ userId }, event),
        ).to.throw('Invalid date');
      });

      it('Get invalid date creating event with current or past date', function () {
        const event = Factory.tree('event', { groupId, date: new Date() });

        return expect(
          () => Meteor.server.method_handlers['events.insert'].call({ userId }, event),
        ).to.throw('Invalid date');
      });

      it('Get not owner if create event for group which user does not own', function () {
        const event = Factory.tree('event', { groupId });

        return expect(
          () => Meteor.server.method_handlers['events.insert'].call({ userId }, event),
        ).to.throw('Not owner');
      });

      it('Create group', function () {
        const event = Factory.tree('event', { groupId: ownedGroupId });

        return Meteor.server.method_handlers['events.insert']
          .call({ userId }, event);
      });
    });
  });

  describe('Events methods', function () {
    describe('Get unauthorized using methods when not signed in', function () {
      before(function () {
        resetDatabase();
      });

      it('Update event', function () {
        return expect(
          () => Meteor.call('events.update'),
        ).to.throw('Unauthorized');
      });

      it('Join event', function () {
        return expect(
          () => Meteor.call('events.joinEvent', 'id'),
        ).to.throw('Unauthorized');
      });

      it('Leave event', function () {
        return expect(
          () => Meteor.call('events.leaveEvent', 'id'),
        ).to.throw('Unauthorized');
      });

      it('Add menu items to event', function () {
        return expect(
          () => Meteor.call('events.addMenuItems'),
        ).to.throw('Unauthorized');
      });

      it('Remove ordering', function () {
        return expect(
          () => Meteor.call('events.removeOrdering', 'id'),
        ).to.throw('Unauthorized');
      });

      it('Set coupon', function () {
        return expect(
          () => Meteor.call('events.setCoupon'),
        ).to.throw('Unauthorized');
      });

      it('Update status', function () {
        return expect(
          () => Meteor.call('events.updateStatus'),
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

      it('Update event', function () {
        return expect(
          () => Meteor.server.method_handlers['events.update'].call({ userId }),
        ).to.throw('Unverified');
      });

      it('Join event', function () {
        return expect(
          () => Meteor.server.method_handlers['events.joinEvent'].call({ userId }, 'id'),
        ).to.throw('Unverified');
      });

      it('Leave event', function () {
        return expect(
          () => Meteor.server.method_handlers['events.leaveEvent'].call({ userId }, 'id'),
        ).to.throw('Unverified');
      });

      it('Add menu items to event', function () {
        return expect(
          () => Meteor.server.method_handlers['events.addMenuItems'].call({ userId }),
        ).to.throw('Unverified');
      });

      it('Remove ordering', function () {
        return expect(
          () => Meteor.server.method_handlers['events.removeOrdering'].call({ userId }, 'id'),
        ).to.throw('Unverified');
      });

      it('Set coupon', function () {
        return expect(
          () => Meteor.server.method_handlers['events.setCoupon'].call({ userId }),
        ).to.throw('Unverified');
      });

      it('Update status', function () {
        return expect(
          () => Meteor.server.method_handlers['events.updateStatus'].call({ userId }),
        ).to.throw('Unverified');
      });
    });

    describe('Use owner methods', function () {
      let userId = null;
      let eventId = null;

      before(function () {
        resetDatabase();
        const user = Factory.create('users');
        userId = user._id;
      });

      describe('Got not owner if user is not owner', function () {
        before(function () {
          const event = Factory.create('events');
          eventId = event._id;
        });

        it('Update event', function () {
          return expect(
            () => Meteor.server.method_handlers['events.update']
            .call({ userId }, { id: eventId }),
          ).to.throw('Not owner');
        });

        it('Add menu items to event', function () {
          return expect(
            () => Meteor.server.method_handlers['events.addMenuItems']
            .call({ userId }, { id: eventId, items: ['id'] }),
          ).to.throw('Not owner');
        });

        it('Set coupon', function () {
          return expect(
            () => Meteor.server.method_handlers['events.setCoupon']
            .call({ userId }, { eventId, userId, itemId: 'id', discount: 30 }),
          ).to.throw('Not owner');
        });

        it('Update status', function () {
          return expect(
            () => Meteor.server.method_handlers['events.updateStatus']
            .call({ userId }, { id: eventId, status: 'ordering' }),
          ).to.throw('Not owner');
        });
      });

      describe('User is owner', function () {
        before(function () {
          const event = Factory.create('events', { creator: userId });
          eventId = event._id;
        });

        describe('Update event', function () {
          it('Get error with empty fields', function () {
            return expect(
              () => Meteor.server.method_handlers['events.update']
                .call({ userId }, { id: eventId }),
            ).to.throw();
          });

          it('Update name', function () {
            return Meteor.server.method_handlers['events.update']
            .call({ userId }, { id: eventId, name: 'new' });
          });

          it('Update title', function () {
            return Meteor.server.method_handlers['events.update']
            .call({ userId }, { id: eventId, title: 'new' });
          });

          it('Update date', function () {
            return Meteor.server.method_handlers['events.update']
            .call({ userId }, { id: eventId, date: faker.date.future() });
          });

          it('Get invalid date if date pass or current', function () {
            return expect(
              () => Meteor.server.method_handlers['events.update']
                .call({ userId }, { id: eventId, date: faker.date.past() }),
            ).to.throw('Invalid date');
          });
        });

        it('Add menu items to event', function () {
          return Meteor.server.method_handlers['events.addMenuItems']
            .call({ userId }, { id: eventId, items: ['id'] });
        });

        it('Set coupon', function () {
          return Meteor.server.method_handlers['events.setCoupon']
            .call({ userId }, { eventId, userId, itemId: 'id', discount: 30 });
        });

        it('Update status', function () {
          return Meteor.server.method_handlers['events.updateStatus']
            .call({ userId }, { id: eventId, status: 'ordering' });
        });
      });
    });

    describe('Participant methods', function () {
      let userId = null;
      let eventId = null;

      before(function () {
        resetDatabase();
        const user = Factory.create('users');
        userId = user._id;
      });

      describe('User is not participant', function () {
        before(function () {
          const group = Factory.create('groups');
          const event = Factory.create('events', { groupId: group._id });
          eventId = event._id;
        });

        it('Get not member if user was not invited', function () {
          return expect(
            () => Meteor.server.method_handlers['events.joinEvent']
            .call({ userId }, eventId),
          ).to.throw('Not member');
        });
      });

      describe('User is participant', function () {
        before(function () {
          const member = Factory.build('member', { _id: userId });
          const group = Factory.create('groups', { members: [member] });
          const event = Factory.create('events', { groupId: group._id });
          eventId = event._id;
        });

        it('Join event', function () {
          return Meteor.server.method_handlers['events.joinEvent']
            .call({ userId }, eventId);
        });
      });

      describe('Get error if event was ordered', function () {
        before(function () {
          const event = Factory.create('events', { status: 'ordered' });
          eventId = event._id;
        });

        it('Join event', function () {
          return expect(
            () => Meteor.server.method_handlers['events.joinEvent']
            .call({ userId }, eventId),
          ).to.throw('Event ordered');
        });

        it('Leave event', function () {
          return expect(
            () => Meteor.server.method_handlers['events.leaveEvent']
            .call({ userId }, eventId),
          ).to.throw('Event ordered');
        });

        it('Remove ordering', function () {
          return expect(
            () => Meteor.server.method_handlers['events.removeOrdering']
            .call({ userId }, eventId),
          ).to.throw('Event ordered');
        });
      });

      describe('No errors is event ordering', function () {
        before(function () {
          const participant = Factory.build('participant', { _id: userId });
          const event = Factory.create('events', {
            participants: [participant],
            status: 'ordering',
          });
          eventId = event._id;
        });

        it('Remove ordering', function () {
          return Meteor.server.method_handlers['events.removeOrdering']
            .call({ userId }, eventId);
        });

        it('Leave event', function () {
          return Meteor.server.method_handlers['events.leaveEvent']
            .call({ userId }, eventId);
        });
      });
    });
  });

  describe('Events publications', function () {
    const userId = 'id';
    let groupId = null;
    let insertedEvents = null;

    describe('For unauthorized user', function () {
      before(function () {
        resetDatabase();
        insertedEvents = _.times(3, () => Factory.create('events', { groupId: 'id' }));
      });

      it('Event publication return empty cursor', function () {
        const collector = new PublicationCollector();

        return collector.collect('Event', insertedEvents[0]._id, (collections) => {
          should().not.exist(collections.events);
        });
      });

      it('Events publication return empty cursor', function () {
        const collector = new PublicationCollector();

        return collector.collect('Events', 'id', (collections) => {
          should().not.exist(collections.events);
        });
      });

      it('GroupEvents publication return empty cursor', function () {
        const collector = new PublicationCollector();

        return collector.collect('GroupEvents', 'id', (collections) => {
          should().not.exist(collections.events);
        });
      });
    });

    describe('For authorized user', function () {
      describe('User is not group member or creator', function () {
        before(function () {
          resetDatabase();
          const group = Factory.create('groups');
          groupId = group._id;
          insertedEvents = _.times(3, () => Factory.create('events', { groupId }));
        });

        it('Event publication return empty cursor', function () {
          const collector = new PublicationCollector({ userId });

          return collector.collect('Event', insertedEvents[0]._id, (collections) => {
            should().not.exist(collections.events);
          });
        });

        it('Events publication return empty cursor', function () {
          const collector = new PublicationCollector({ userId });

          return collector.collect('Events', insertedEvents[0]._id, (collections) => {
            expect(collections.events).have.lengthOf(0);
          });
        });

        it('GroupEvents publication return 3/3 items', function () {
          const collector = new PublicationCollector({ userId });

          return collector.collect('GroupEvents', groupId, (collections) => {
            expect(collections.events).have.lengthOf(3);
          });
        });
      });

      describe('User is group member or creator', function () {
        describe('User is not event participant and creator', function () {
          before(function () {
            resetDatabase();
            const member = Factory.build('member', { _id: userId });
            const group = Factory.create('groups', { members: [member] });
            groupId = group._id;
            insertedEvents = _.times(3, () =>
              Factory.create('events', { groupId }));
          });

          it('Event publication return event', function () {
            const collector = new PublicationCollector({ userId });

            return collector.collect('Event', insertedEvents[0]._id, (collections) => {
              expect(collections.events).have.lengthOf(1);
            });
          });

          it('Events publication return empty cursor', function () {
            const collector = new PublicationCollector({ userId });

            return collector.collect('Events', {}, (collections) => {
              expect(collections.events).have.lengthOf(0);
            });
          });
        });

        describe('User is participant of 3 events', function () {
          before(function () {
            resetDatabase();
            const member = Factory.build('member', { _id: userId });
            const group = Factory.create('groups', { members: [member] });
            groupId = group._id;
            const participant = Factory.build('participant', { _id: userId });
            insertedEvents = _.times(3, () =>
              Factory.create('events', { groupId, participants: [participant] }));
          });

          it('Events publication return 3 items', function () {
            const collector = new PublicationCollector({ userId });

            return collector.collect('Events', {}, (collections) => {
              expect(collections.events).have.lengthOf(3);
            });
          });
        });

        describe('User is creator of 3 events and not participant', function () {
          before(function () {
            resetDatabase();
            const member = Factory.build('member', { _id: userId });
            const group = Factory.create('groups', { members: [member] });
            groupId = group._id;
            insertedEvents = _.times(3, () =>
              Factory.create('events', { groupId, creator: userId }));
          });

          it('Events publication return 3 items', function () {
            const collector = new PublicationCollector({ userId });

            return collector.collect('Events', {}, (collections) => {
              expect(collections.events).have.lengthOf(3);
            });
          });
        });
      });
    });
  });
});
