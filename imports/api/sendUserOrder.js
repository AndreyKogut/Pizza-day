import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import Events from './events/collection';
import Orders from './orders/collection';
import Menu from './menu/collection';
import orderEmail from '../ui/emails/OrderTemplate';

function sendUserOrder(eventId) {
  const event = Events.findOne(eventId);
  const eventName = event.name;
  const eventDate = event.date;
  const eventMembers = event.participants;

  _.map(eventMembers, (member) => {
    const user = Meteor.users.findOne(member._id);
    const email = user.emails[0].address;
    const userName = user.profile.name;

    const order = Orders.findOne(member.order);
    const totalPrice = order.totalPrice;
    const orderMenuItemsWithCount = order.menu;
    const menuMap = new Map();
    _.map(orderMenuItemsWithCount, (item) => {
      menuMap.set(item._id, item.count);
    });
    const orderMenuItems = _.pluck(orderMenuItemsWithCount, '_id');

    const fullMenuItems = Menu.find({ _id: { $in: [...orderMenuItems] } }).fetch();
    const menuItemsShowFormat = [];
    _.map(fullMenuItems, ({ _id, name, price }) => {
      menuItemsShowFormat.push({
        name,
        price,
        count: menuMap.get(_id),
      });
    });

    Email.send({
      from: 'pizza-day@mail.com',
      to: email,
      subject: 'Menu order',
      html: orderEmail({
        userName,
        eventName,
        eventDate,
        totalPrice,
        items: menuItemsShowFormat,
      }),
    });
  });

}

export default sendUserOrder;
