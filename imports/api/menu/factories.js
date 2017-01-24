import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import Menu from './collection';

Factory.define('menu', Menu, {
  name: () => faker.commerce.productName(),
  description: () => faker.lorem.sentences(),
  mass: () => `${faker.random.number()}g`,
  price: () => faker.commerce.price(),
});

Factory.define('menuItem', null, {
  _id: faker.random.uuid(),
  count: faker.random.number(),
});
