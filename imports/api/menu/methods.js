import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Groups from '../groups/collection';
import Menu from './collection';
import Event from '../events/collection';
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

  const eventMenu = Event.findOne({ _id: id }).menu || [];

  return Menu.find({ _id: { $in: [...eventMenu] } });
});
