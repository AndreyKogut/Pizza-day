import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';
import { mount } from 'react-mounter';
import UserCabinetContainer from '../ui/UserCabinet';
import SignUp from '../ui/SignUp';
import Login from '../ui/Login';
import GroupsPageContainer from '../ui/Groups';
import GroupPageContainer from '../ui/Group';
import EventContainer from '../ui/Event';
import CreateGroup from '../ui/CreateGroup';
import CreateEvent from '../ui/CreateEvent';
import App from '../ui/App';

Accounts.onLogin(() => {
  const current = FlowRouter.current().path;
  if (current === '/signin' || current === '/signup') {
    FlowRouter.go('/user/:id', { id: Meteor.userId() });
  }
});

Accounts.onLogout(() => {
  FlowRouter.go('/signin');
});

const app = FlowRouter.group({
  name: 'app',
  //triggersEnter: [(context, redirect) => {}],
});

app.route('/', {
  name: 'Home',
  action() {
    mount(App);
  },
});

app.route('/user/:id', {
  name: 'Cabinet',
  action({ id }) {
    mount(App, {
      content: () => (<UserCabinetContainer id={id} />),
    });
  },
});

app.route('/groups', {
  name: 'Groups',
  action() {
    mount(App, {
      content: () => (<GroupsPageContainer />),
    });
  },
});

app.route('/groups/:id', {
  name: 'Group',
  action({ id }) {
    mount(App, {
      content: () => (<GroupPageContainer id={id} />),
    });
  },
});

app.route('/groups/:id/create-event', {
  name: 'CreateEvent',
  action({ id }) {
    mount(App, {
      content: () => (<CreateEvent id={id} />),
    });
  },
});

app.route('/groups/:id/events/:eventId', {
  name: 'CreateEvent',
  action({ id, eventId }) {
    mount(App, {
      content: () => (<EventContainer id={id} eventId={eventId} />),
    });
  },
});

app.route('/create-group', {
  name: 'CreateGroup',
  action() {
    mount(App, {
      content: () => (<CreateGroup />),
    });
  },
});

app.route('/signin', {
  name: 'SignIn',
  action() {
    mount(App, {
      content: () => (<Login />),
    });
  },
});

app.route('/signup', {
  name: 'SignUp',
  action() {
    mount(App, {
      content: () => (<SignUp />),
    });
  },
});
