import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Groups from './collection';
import checkData from '../checkData';

Meteor.methods({
  'groups.insert': function insert(requestData) {
    const requestDateStructure = {
      name: String,
      description: Match.Maybe(String),
      avatar: Match.Maybe(String),
      members: Match.Maybe([String]),
      menu: [String],
    };

    check(requestData, requestDateStructure);
    check(requestData.name, Match.Where(checkData.notEmpty));
    check(requestData.menu, Match.Where(checkData.stringList));

    const id = new Meteor.Collection.ObjectID().valueOf();
    const { members: membersToInsert = [], ...fieldsToInsert } = requestData;

    membersToInsert.unshift(this.userId);

    Groups.insert({
      _id: id,
      ...fieldsToInsert,
      events: [],
      membersToInsert,
      createdAt: new Date(),
    });

    return id;
  },
});

Meteor.publish('Groups', function getGroups() {
  check(this.userId, Match.Where(checkData.notEmpty));
  return Groups.find({ members: this.userId }, { sort: { createdAt: -1 } });
});

Meteor.publish('Group', (id) => {
  check(id, String);
  return Groups.find(id);
});
