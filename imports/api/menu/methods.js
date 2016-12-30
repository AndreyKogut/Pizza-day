import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Groups from '../groups/collection';
import Menu from './collection';
import Event from '../events/collection';
import checkData from '../checkData';

Meteor.methods({
  'menu.insert': function insert(requestData) {
    const requestDataStructure = {
      name: String,
      description: String,
      mass: String,
      price: Number,
    };

    if (!this.userId) {
      throw new Meteor.Error(403, 'Access denied');
    }

    check(requestData, requestDataStructure);
    check(requestData.name, Match.Where(checkData.notEmpty));
    check(requestData.description, Match.Where(checkData.notEmpty));
    check(requestData.mass, Match.Where(checkData.notEmpty));

    Menu.insert({
      _id: new Meteor.Collection.ObjectID().valueOf(),
      ...requestData,
    });
  },
});

Meteor.publish('Menu', () => Menu.find());

Meteor.publish('GroupMenu', function publishGroupMenu(id) {
  check(id, Match.Where(checkData.notEmpty));

  if (!this.userId) {
    return this.error(new Meteor.Error(403, 'Access denied'));
  }

  const groupMenu = Groups.findOne({ _id: id }).menu || [];

  return Menu.find({ _id: { $in: [...groupMenu] } });
});

Meteor.publish('EventMenu', function publishMenu(id) {
  check(id, Match.Where(checkData.notEmpty));

  if (!this.userId) {
    return this.error(new Meteor.Error(403, 'Access denied'));
  }

  const eventMenu = Event.findOne({ _id: id }).menu || [];

  return Menu.find({ _id: { $in: [...eventMenu] } });
});
