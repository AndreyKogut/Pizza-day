import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import Events from '../../api/events/collection';

Factory.define('events', Events, {
  name: () => faker.name.title(),
  status: 'ordering',
  groupId: () => faker.random.uuid(),
  title: () => faker.lorem.sentences(),
  creator: () => faker.random.uuid(),
  menu: () => [],
  date: () => faker.date.future(),
  participants: [],
  createdAt: () => new Date(),
});

Factory.define('event', null, {
  name: () => faker.name.title(),
  groupId: () => faker.random.uuid(),
  title: () => faker.lorem.sentences(),
  menu: () => [],
  date: () => faker.date.future(),
});
