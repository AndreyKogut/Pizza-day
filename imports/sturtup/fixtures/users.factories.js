import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';

Factory.define('email', null, {
  address: () => faker.internet.email(),
  verified: true,
});

Factory.define('member', null, {
  _id: () => faker.random.uuid(),
  verified: true,
});

Factory.define('participant', null, {
  _id: () => faker.random.uuid(),
  order: () => faker.random.uuid(),
  coupons: [],
  ordered: false,
});

Factory.define('user', null, {
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
  name: () => faker.name.findName(),
  company: () => faker.company.companyName(),
  position: () => faker.name.jobTitle(),
  about: () => faker.lorem.sentences(),
});

Factory.define('users', Meteor.users, {
  emails: [() => Factory.tree('email')],
  profile: {
    name: () => faker.name.findName(),
    avatar: () => faker.internet.avatar(),
    company: () => faker.company.companyName(),
    position: () => faker.name.jobTitle(),
    about: () => faker.lorem.sentences(),
  },
});
