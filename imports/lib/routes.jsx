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
import EventsPageContainver from '../ui/pages/EventsPage';
import App from '../ui/App';

const privateRouteOnEnter = (context, redirect) => {
  if (!Meteor.userId()) redirect('/signin');
};

Accounts.onLogin(() => {
  const current = FlowRouter.current().path;
  if (current === '/signin' || current === '/signup') {
    FlowRouter.go('/users/:id', { id: Meteor.userId() });
  }
});

Accounts.onLogout(() => {
  FlowRouter.go('/signin');
});

const publicRouts = FlowRouter.group({
  name: 'publicRouts',
});

const privateRouts = FlowRouter.group({
  name: 'publicRouts',
  triggersEnter: [privateRouteOnEnter],
});

publicRouts.route('/', {
  name: 'Home',
  action() {
    mount(App);
  },
});

publicRouts.route('/signin', {
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

privateRouts.route('/groups/:id/create-event', {
  name: 'CreateEvent',
  action({ id }) {
    mount(App, {
      content: () => (<CreateEvent id={id} />),
    });
  },
});

privateRouts.route('/events', {
  name: 'UserEvents',
  action() {
    mount(App, {
      content: () => (<EventsPageContainver />),
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
    mount(App, {
      content: () => (<div>Not found</div>),
    });
  },
};
