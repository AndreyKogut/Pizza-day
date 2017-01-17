import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import Events from './events/collection';
import Orders from './orders/collection';
import Menu from './menu/collection';
import orderEmail from '../ui/emails/OrderTemplate';
import ownerEmail from '../ui/emails/OwnerOrdersTemplate';

function sendOrders(eventId) {
  const event = Events.findOne(eventId);
  const eventName = event.name;
  const eventDate = event.date;
  const eventMembers = event.participants;
  const eventCreatorId = event.creator;

  const eventMenuItems = [];
  const allUsersMenuItems = new Map();
  let ordersTotal = 0;

  _.map(eventMembers, ({ _id: memberId, order: memberOrder }) => {
    const user = Meteor.users.findOne(memberId);
    const email = user.emails[0].address;
    const userName = user.profile.name;

    const order = Orders.findOne(memberOrder);
    const totalPrice = order.totalPrice;
    ordersTotal += totalPrice;

    const orderMenuItemsWithCount = order.menu;
    const menuMap = new Map();
    eventMenuItems.push(...orderMenuItemsWithCount);

    _.each(orderMenuItemsWithCount, ({ _id: id, count }) => {
      menuMap.set(id, count);
    });
    const orderMenuItems = _.pluck(orderMenuItemsWithCount, '_id');

    const fullMenuItems = Menu.find({ _id: { $in: orderMenuItems } }).fetch();
    const menuItemsShowFormat = _.map(fullMenuItems, ({ _id, name, price }) => {
      allUsersMenuItems.set(_id, { name, price });

      return {
        name,
        price,
        count: menuMap.get(_id),
      };
    });

    try {
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
    } catch (err) { /* not me */ }
  });

  const creator = Meteor.users.findOne(eventCreatorId);
  const creatorAddress = creator.emails[0].address;
  const eventItemsToOwner =
    _.chain(eventMenuItems)
    .groupBy(({ _id: id }) => id)
    .map((item, key) => ({
      name: allUsersMenuItems.get(key).name,
      price: allUsersMenuItems.get(key).price,
      count: _.reduce([...item],
        (sum, num) => sum + num.count, 0),
    }))
    .value();

  try {
    Email.send({
      from: 'pizza-day@mail.com',
      to: creatorAddress,
      subject: 'Event ordered',
      html: ownerEmail({
        userName: creator.profile.name,
        eventName,
        eventDate,
        items: eventItemsToOwner,
        totalPrice: ordersTotal,
      }),
    });
  } catch (err) { /* not me */ }
}

export default sendOrders;
