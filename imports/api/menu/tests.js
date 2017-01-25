/* eslint-disable func-names, prefer-arrow-callback */
/* eslint-disable no-unused-expressions */

import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect, should } from 'meteor/practicalmeteor:chai';
import { stubs } from 'meteor/practicalmeteor:sinon';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import Orders from '../orders/collection';
import './methods';

describe('Menu publications testing', function () {
  after(function () {
    resetDatabase();
  });

  describe('For unauthorized user', function () {
    before(function () {
      resetDatabase();
      _.times(3, () => Factory.create('menu', { price: 10 }));
    });

    it('Menu publication return 3/3 items', function () {
      const collector = new PublicationCollector();

      return collector.collect('Menu', {}, (collections) => {
        expect(collections.menu).have.lengthOf(3);
      });
    });

    it('MenuFiltered publication return 3/3 items with default filter', function () {
      const collector = new PublicationCollector();
      const filter = {
        filter: {
          gte: 0,
          lte: 10,
          name: '',
        },
        limiter: 3,
      };

      return collector.collect('MenuFiltered', filter, (collections) => {
        expect(collections.menu).have.lengthOf(3);
      });
    });

    it('GroupMenu publication return empty cursor', function () {
      const collector = new PublicationCollector();

      return collector.collect('GroupMenu', 'id', (collections) => {
        should().not.exist(collections.menu);
      });
    });

    it('GroupMenuForEvent publication return empty cursor', function () {
      const collector = new PublicationCollector();

      return collector.collect('GroupMenuForEvent', 'id', (collections) => {
        should().not.exist(collections.menu);
      });
    });

    it('EventMenu publication return empty cursor', function () {
      const collector = new PublicationCollector();

      return collector.collect('EventMenu', 'id', (collections) => {
        should().not.exist(collections.menu);
      });
    });

    it('OrderMenu publication return empty cursor', function () {
      const collector = new PublicationCollector();

      return collector.collect('OrderMenu', 'id', (collections) => {
        should().not.exist(collections.menu);
      });
    });
  });

  describe('For authorized user', function () {
    const userId = 'id';
    let menuIds = null;
    let groupId = null;
    let eventId = null;
    let orderMenu = null;

    before(function () {
      resetDatabase();
      const menu = _.times(3, () => Factory.create('menu', { price: 10 }));
      menuIds = _.pluck(menu, '_id');

      // map menu to object with _id and random field(name) for publication pluck
      orderMenu = _.map(menu, item => ({ _id: item._id, name: item.name }));
      const group = Factory.create('groups', { menu: menuIds });
      groupId = group._id;
      const event = Factory.create('events', { groupId, menu: menuIds });
      eventId = event._id;
    });

    after(function () {
      stubs.restoreAll();
    });

    it('GroupMenu publication return 3/3 items', function () {
      const collector = new PublicationCollector({ userId });

      return collector.collect('GroupMenu', groupId, (collections) => {
        expect(collections.menu).have.lengthOf(3);
      });
    });

    it('GroupMenuForEvent publication return 3/3 items', function () {
      const collector = new PublicationCollector({ userId });

      return collector.collect('GroupMenuForEvent', eventId, (collections) => {
        expect(collections.menu).have.lengthOf(3);
      });
    });

    it('EventMenu publication return 3/3 items', function () {
      const collector = new PublicationCollector({ userId });

      return collector.collect('EventMenu', eventId, (collections) => {
        expect(collections.menu).have.lengthOf(3);
      });
    });

    it('OrderMenu publication return empty cursor', function () {
      const collector = new PublicationCollector({ userId });

      stubs.create('findOne', Orders, 'findOne');
      stubs.findOne.returns({ userId, menu: orderMenu });

      return collector.collect('OrderMenu', 'id', (collections) => {
        expect(collections.menu).have.lengthOf(3);
      });
    });
  });
});
