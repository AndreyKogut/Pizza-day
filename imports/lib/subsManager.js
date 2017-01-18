import { Meteor } from 'meteor/meteor';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';

const menuSubsManager = new SubsManager();
const usersSubsManager = new SubsManager();
const eventsSubsManager = new SubsManager();
const groupsSubsManager = new SubsManager();
const orderSubsManager = new SubsManager();

export {
  menuSubsManager,
  usersSubsManager,
  eventsSubsManager,
  groupsSubsManager,
  orderSubsManager,
};
