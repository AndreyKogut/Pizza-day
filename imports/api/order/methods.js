import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { notEmpty } from '../checkData';
import Orders from './collection';

Meteor.methods({
  'orders.insert': function orderInsert(requestData) {
    const requestDataStructure = {
      menu: Match.Maybe([{
        _id: Match.Where(notEmpty),
        count: Number,
      }]),
      userId: Match.Where(notEmpty),
      coupons: Match.Maybe([{
        _id: Match.Where(notEmpty),
        discount: Match.Maybe(Number),
        count: Match.Maybe(Number),
      }]),
    };

    check(requestData, requestDataStructure);

    if (!this.userId) {
      throw new Meteor.Error(403, 'Log in');
    }

    Orders.insert(requestData);
  },
});
