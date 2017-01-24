import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import Groups from './collection';

Factory.define('group', null, {
  name: () => faker.name.title(),
  description: () => faker.lorem.sentences(),
  avatar: faker.internet.avatar(),
  menu: [],
  members: [],
});

Factory.define('groups', Groups, {
  name: () => faker.name.title(),
  description: () => faker.lorem.sentences(),
  avatar: faker.internet.avatar(),
  creator: () => faker.random.uuid,
  menu: [],
  members: [],
  createdAt: () => new Date(),
});
