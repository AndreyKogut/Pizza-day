/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { expect, should } from 'meteor/practicalmeteor:chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './methods';

describe('Orders collection/methods testing', function () {
  describe('Creating order', function () {
    let userId = null;
    let verifiedUserId = null;

    before(function () {
      const unverifiedEmail = Factory.build('email', { verified: false });
      const unverifiedUser = Factory.create('users', { emails: [unverifiedEmail] });
      userId = unverifiedUser._id;

      const user = Factory.create('users');
      verifiedUserId = user._id;
    });

    it('Get unauthorized for not signed in user', function () {
      return expect(
        () => Meteor.call('orders.insert'),
      ).to.throw('Unauthorized');
    });

    it('Get unverified for user without verified email', function () {
      return expect(
        () => Meteor.server.method_handlers['orders.insert'].call({ userId }),
      ).to.throw('Unverified');
    });

    it('Get error if send empty object', function () {
      return expect(
        () => Meteor.server.method_handlers['orders.insert'].call({ userId: verifiedUserId }, {}),
      ).to.throw();
    });

    it('Get not member if user is not event participant', function () {
      const event = Factory.create('events');
      const order = Factory.build('order', { eventId: event._id });

      return expect(
        () => Meteor.server.method_handlers['orders.insert'].call({ userId: verifiedUserId }, order),
      ).to.throw();
    });

    it('Create order', function () {
      const participant = Factory.build('participant', { _id: verifiedUserId });
      const event = Factory.create('events', { participants: [participant] });
      const order = Factory.tree('order', { eventId: event._id });

      return Meteor.server.method_handlers['orders.insert']
        .call({ userId: verifiedUserId }, order);
    });
  });

  describe('Remove order', function () {
    let userId = null;
    let verifiedUserId = null;

    before(function () {
      const unverifiedEmail = Factory.build('email', { verified: false });
      const unverifiedUser = Factory.create('users', { emails: [unverifiedEmail] });
      userId = unverifiedUser._id;

      const user = Factory.create('users');
      verifiedUserId = user._id;
    });

    it('Get unauthorized for not signed in user', function () {
      return expect(
        () => Meteor.call('orders.insert'),
      ).to.throw('Unauthorized');
    });

    it('Get unverified for user without verified email', function () {
      return expect(
        () => Meteor.server.method_handlers['orders.insert'].call({ userId }, 'id'),
      ).to.throw('Unverified');
    });

    it('Get not owner if user do not own order', function () {
      const order = Factory.create('orders');

      return expect(
        () => Meteor.server.method_handlers['orders.insert'].call({ userId: verifiedUserId }, order._id),
      ).to.throw();
    });

    it('Remove', function () {
      const order = Factory.create('orders', { userId: verifiedUserId });

      return Meteor.server.method_handlers['orders.remove']
        .call({ userId: verifiedUserId }, order._id);
    });
  });

  describe('Orders publications', function () {
    const userId = 'id';
    let ovnedOrderId = null;
    let orderId = null;

    before(function () {
      const order = Factory.create('orders');
      orderId = order._id;
      const ownedOrder = Factory.create('orders', { userId });
      ovnedOrderId = ownedOrder._id;
    });

    it('Get order if unauthorized', function () {
      const collector = new PublicationCollector();

      return collector.collect('Order', 'id', (collections) => {
        should().not.exist(collections.orders);
      });
    });

    it('Get order if unauthorized', function () {
      const collector = new PublicationCollector();

      return collector.collect('Order', 'id', (collections) => {
        should().not.exist(collections.orders);
      });
    });

    it('Get empty cursor user do not own requested order', function () {
      const collector = new PublicationCollector({ userId });

      return collector.collect('Order', orderId, (collections) => {
        expect(collections.orders).have.lengthOf(0);
      });
    });

    it('Get order', function () {
      const collector = new PublicationCollector({ userId });

      return collector.collect('Order', ovnedOrderId, (collections) => {
        expect(collections.orders).have.lengthOf(1);
      });
    });
  });
});
