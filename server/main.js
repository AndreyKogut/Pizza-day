import { Meteor } from 'meteor/meteor';
import ReactHTMLEmail from 'react-html-email';
import '../imports/api/emailVerificationConfigs';
import '../imports/api/googleOauth';
import '../imports/api/users/methods';
import '../imports/api/events/methods';
import '../imports/api/menu/methods';
import '../imports/api/groups/methods';
import '../imports/api/avatars/collection';
import '../imports/api/orders/methods';
import MenuItem from '../imports/sturtup/server/fixtures';
import Menu from '../imports/api/menu/collection';

Meteor.startup(() => {
  process.env.MAIL_URL = Meteor.settings.smtp;
  ReactHTMLEmail.injectReactEmailAttributes();

  _ = lodash;

  const menuItemsCount = Menu.find().fetch().length;

  if (!menuItemsCount) {
    for (let i = 0; i < 50; i += 1) {
      Meteor.call('menu.insert', new MenuItem());
    }
  }
});
