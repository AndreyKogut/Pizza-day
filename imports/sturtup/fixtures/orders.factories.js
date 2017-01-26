import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import Orders from '../../api/orders/collection';

Factory.define('orders', Orders, {
  eventId: () => faker.random.uuid(),
  userId: () => faker.random.uuid(),
  totalPrice: () => faker.random.number(),
  menu: [() => Factory.build('menuItem')],
});

Factory.define('order', null, {
  eventId: () => faker.random.uuid(),
  menu: [() => Factory.build('menuItem')],
});
