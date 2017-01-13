import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { mount } from 'react-mounter';
import UserCabinetContainer from '../ui/pages/UserCabinet';
import SignUp from '../ui/pages/SignUp';
import Login from '../ui/pages/Login';
import GroupsPageContainer from '../ui/pages/GroupsPage';
import GroupPageContainer from '../ui/pages/GroupPage';
import EventPageContainer from '../ui/pages/EventPage';
import CreateGroupContainer from '../ui/pages/CreateGroup';
import CreateEvent from '../ui/pages/CreateEvent';
import EventsPageContainer from '../ui/pages/EventsPage';
import handleMethodsCallbacks from '../helpers/handleMethodsCallbacks';
import App from '../ui/App';

const appOnEnter = (context, redirect) => {
  if (!Meteor.userId()) redirect('/login');
};


Accounts.onEmailVerificationLink((token) => {
  Accounts.verifyEmail(token, handleMethodsCallbacks(() => {
    FlowRouter.go('/users/:id', { id: Meteor.userId() });
  }));
});

Accounts.onLogin(() => {
  FlowRouter.go('/users/:id', { id: Meteor.userId() });
});

Accounts.onLogout(() => {
  FlowRouter.go('/login');
});

const publicRouts = FlowRouter.group({
  name: 'publicRouts',
});

const privateRouts = FlowRouter.group({
  name: 'publicRouts',
  triggersEnter: [appOnEnter],
});

publicRouts.route('/login', {
  name: 'SignIn',
  action() {
    mount(App, {
      content: () => (<Login />),
    });
  },
});

publicRouts.route('/signup', {
  name: 'SignUp',
  action() {
    mount(App, {
      content: () => (<SignUp />),
    });
  },
});

privateRouts.route('/users/:id', {
  name: 'Cabinet',
  action({ id }) {
    mount(App, {
      content: () => (<UserCabinetContainer id={id} />),
    });
  },
});

privateRouts.route('/groups', {
  name: 'Groups',
  action() {
    mount(App, {
      content: () => (<GroupsPageContainer />),
    });
  },
});

privateRouts.route('/groups/:id', {
  name: 'Group',
  action({ id }) {
    mount(App, {
      content: () => (<GroupPageContainer id={id} />),
    });
  },
});

privateRouts.route('/groups/:groupId/create-event', {
  name: 'CreateEvent',
  action({ groupId }) {
    mount(App, {
      content: () => (<CreateEvent groupId={groupId} />),
    });
  },
});

privateRouts.route('/events', {
  name: 'UserEvents',
  action() {
    mount(App, {
      content: () => (<EventsPageContainer />),
    });
  },
});

privateRouts.route('/groups/:id/events/:eventId', {
  name: 'CreateEvent',
  action({ id, eventId }) {
    mount(App, {
      content: () => (<EventPageContainer id={id} eventId={eventId} />),
    });
  },
});

privateRouts.route('/create-group', {
  name: 'CreateGroup',
  action() {
    mount(App, {
      content: () => (<CreateGroupContainer />),
    });
  },
});

FlowRouter.notFound = {
  action() {
    FlowRouter.go('/login');
  },
};
