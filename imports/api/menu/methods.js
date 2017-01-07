import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Groups from '../groups/collection';
import Menu from './collection';
import Events from '../events/collection';
import Orders from '../orders/collection';
import { notEmpty } from '../checkData';

Meteor.methods({
  'menu.insert': function insert(requestData) {
    const requestDataStructure = {
      name: Match.Where(notEmpty),
      description: Match.Where(notEmpty),
      mass: Match.Where(notEmpty),
      price: Number,
    };

    check(requestData, requestDataStructure);

    Menu.insert(requestData);
  },
});

Meteor.publish('Menu', () => Menu.find());

Meteor.publish('GroupMenu', function publishGroupMenu(id) {
  check(id, Match.Where(notEmpty));

  if (!this.userId) {
    return this.error(new Meteor.Error(401, 'Access denied'));
  }

  const groupMenu = Groups.findOne({ _id: id }).menu || [];

  return Menu.find({ _id: { $in: [...groupMenu] } });
});

Meteor.publish('EventMenu', function publishMenu(id) {
  check(id, Match.Where(notEmpty));

  if (!this.userId) {
    return this.error(new Meteor.Error(401, 'Access denied'));
  }

  const eventMenu = Events.findOne({ _id: id }).menu || [];

  return Menu.find({ _id: { $in: [...eventMenu] } });
});

Meteor.publish('OrderMenu', function publishOrder(id) {
  check(id, Match.Where(notEmpty));

  const order = Orders.findOne({ _id: id });

  if (this.userId !== order.userId) {
    return this.ready();
  }

  const menuItems = _.pluck(order.menu, '_id');

  return Menu.find({ _id: { $in: [...menuItems] } });
});
