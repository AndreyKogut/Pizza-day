/* eslint-disable func-names, prefer-arrow-callback */
/* eslint-disable no-unused-expressions */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { stubs } from 'meteor/practicalmeteor:sinon';
import { expect } from 'meteor/practicalmeteor:chai';
import faker from 'faker';
import './methods';

Factory.define('users', Meteor.users, {
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
  name: () => faker.name.findName(),
  company: () => faker.company.companyName(),
  position: () => faker.name.jobTitle(),
  about: () => faker.lorem.sentences(),
});

describe('Users collection/methods testing', function () {
  after(function () {
    resetDatabase();
  });

  describe('Creating user', function () {
    it('Creating user with full info', function () {
      const user = Factory.tree('users');

      return Meteor.call('user.insert', user);
    });

    it('Get error creating user with empty object', function () {
      return expect(
        () => Meteor.call('user.insert', {}),
      ).to.throw();
    });

    it('Get error creating user without name', function () {
      const user = Factory.tree('users', { name: '' });

      return expect(
        () => Meteor.call('user.insert', user),
        ).to.throw('Invalid name');
    });
  });

  describe('Updating user', function () {
    const user = Factory.tree('users');
    const creation = new Promise((resolve, reject) => {
      Meteor.call('user.insert', user, (err) => {
        if (err) {
          reject(err);
        }

        const currentUser = Meteor.users.findOne();
        resolve(currentUser);
      });
    });

    it('Update unauthorized user got unauthorized', function () {
      return expect(
          () => Meteor.call('user.update', {}),
        ).to.throw('Unauthorized');
    });

    it('Update unverified user got unverified', function () {
      return creation.then(function (res) {
        expect(
          () => Meteor.server.method_handlers['user.update'].call({ userId: res._id }, {}),
        ).to.throw('Unverified');
      });
    });

    describe('Signed and verified user updates', function () {
      before(function () {
        const verifiedUser = { emails: [{
          verified: true,
        }] };
        stubs.create('findOne', Meteor.users, 'findOne');
        stubs.findOne.returns(verifiedUser);
      });
      after(function () {
        stubs.restoreAll();
      });

      it('Update user with empty object got error', function () {
        return creation.then(function (res) {
          expect(
            () => Meteor.server.method_handlers['user.update'].call({ userId: res._id }, {}),
          ).to.throw();
        });
      });

      it('Update user profile name', function () {
        return creation.then(function (res) {
          Meteor.server.method_handlers['user.update'].call({ userId: res._id }, { name: 'New' });
        });
      });

      it('Update user profile company', function () {
        return creation.then(function (res) {
          Meteor.server.method_handlers['user.update'].call({ userId: res._id }, { company: 'New' });
        });
      });

      it('Update user profile position', function () {
        return creation.then(function (res) {
          Meteor.server.method_handlers['user.update'].call({ userId: res._id }, { position: 'New' });
        });
      });

      it('Update user profile about', function () {
        return creation.then(function (res) {
          Meteor.server.method_handlers['user.update'].call({ userId: res._id }, { about: 'New' });
        });
      });

      it('Update user profile avatar', function () {
        return creation.then(function (res) {
          Meteor.server.method_handlers['user.update'].call({ userId: res._id }, { avatar: 'New' });
        });
      });
    });
  });
});
