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
import CreateGroup from '../ui/pages/CreateGroup';
import { CreateEventContainer } from '../ui/pages/CreateEvent';
import EventsPageContainer from '../ui/pages/EventsPage';
import PasswordReset from '../ui/pages/PasswordReset';
import ForgotPassword from '../ui/pages/ForgotPassword';
import Coupons from '../ui/pages/Coupons';
import handleMethodsCallbacks from '../helpers/handleMethodsCallbacks';
import App from '../ui/App';

const RD = new ReactiveDict();

FlowRouter.triggers.enter([() => {
  // change protocol to https for g+ (deploy only)

  const url = Meteor.absoluteUrl();
  const protocol = url.slice(0, 5);

  if (protocol !== 'https') {
    window.location.protocol = 'https';
  }
}]);

const privateRouteEnter = (context, redirect) => {
  if (!Meteor.userId()) redirect('/login');
};

const publicRouts = FlowRouter.group({
  name: 'publicRoutes',
});

const privateRouts = FlowRouter.group({
  name: 'privateRoutes',
  triggersEnter: [privateRouteEnter],
});

Accounts.onResetPasswordLink((token) => {
  RD.set('token', token);
  FlowRouter.go('/reset-password');
});

Accounts.onEmailVerificationLink((token) => {
  Accounts.verifyEmail(token, handleMethodsCallbacks(() => {
    FlowRouter.go('/users/:id', { id: Meteor.userId() });
  }));
});

Accounts.onLogin(() => {
  const current = FlowRouter.current().path;
  if (current === '/login' || current === '/signup') {
    FlowRouter.go('/users/:id', { id: Meteor.userId() });
  }
});

Accounts.onLogout(() => {
  FlowRouter.go('/login');
});

publicRouts.route('/login', {
  name: 'SignIn',
  action() {
    mount(App, {
      content: () => <Login />,
    });
  },
});

publicRouts.route('/forgot-password', {
  name: 'Forgot password',
  action() {
    mount(App, {
      content: () => <ForgotPassword />,
    });
  },
});

publicRouts.route('/reset-password', {
  name: 'ResetPassword',
  action() {
    const currentToken = RD.get('token');
    RD.clear();
    if (!currentToken) {
      FlowRouter.go('/login');
    }

    mount(App, {
      content: () => <PasswordReset token={currentToken} />,
    });
  },
});

publicRouts.route('/signup', {
  name: 'SignUp',
  action() {
    mount(App, {
      content: () => <SignUp />,
    });
  },
});

privateRouts.route('/users/:id', {
  name: 'Cabinet',
  action({ id }) {
    mount(App, {
      content: () => <UserCabinetContainer id={id} />,
    });
  },
});

privateRouts.route('/groups', {
  name: 'Groups',
  action() {
    mount(App, {
      content: () => <GroupsPageContainer />,
    });
  },
});

privateRouts.route('/groups/:id', {
  name: 'Group',
  action({ id }) {
    mount(App, {
      content: () => <GroupPageContainer id={id} />,
    });
  },
});

privateRouts.route('/groups/:groupId/create-event', {
  name: 'CreateEvent',
  action({ groupId }) {
    mount(App, {
      content: () => <CreateEventContainer groupId={groupId} />,
    });
  },
});

privateRouts.route('/events', {
  name: 'UserEvents',
  action() {
    mount(App, {
      content: () => <EventsPageContainer />,
    });
  },
});

privateRouts.route('/groups/:id/events/:eventId', {
  name: 'CreateEvent',
  action({ id, eventId }) {
    mount(App, {
      content: () => <EventPageContainer id={id} eventId={eventId} />,
    });
  },
});

privateRouts.route('/groups/:id/events/:eventId/coupons', {
  name: 'CreateEvent',
  action({ id, eventId }) {
    mount(App, {
      content: () => <Coupons id={id} eventId={eventId} />,
    });
  },
});

privateRouts.route('/create-group', {
  name: 'CreateGroup',
  action() {
    mount(App, {
      content: () => <CreateGroup />,
    });
  },
});

FlowRouter.notFound = {
  action() {
    if (FlowRouter.current().path === '/') {
      if (Meteor.userId()) {
        FlowRouter.go(FlowRouter.path('/users/:id', { id: Meteor.userId() }));
      } else {
        FlowRouter.go('/login');
      }
    }

    mount(App, {
      content: () => <div className="not-found">Not found <span className="mdl-color-text--primary">404</span></div>,
    });
  },
};
