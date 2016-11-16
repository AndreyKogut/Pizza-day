import { Meteor } from 'meteor/meteor';
import {AccountsTemplates} from 'meteor/useraccounts:core';
import {FlowRouter} from 'meteor/kadira:flow-router';

import {Accounts} from 'meteor/accounts-base';

import {mount} from 'react-mounter';

import {AppContainer} from '../ui/App';
import {LoginContainer} from '../ui/Login';
import {SignUpContainer} from '../ui/SignUp';

Accounts.onLogin(() => {
	FlowRouter.go('/');
});

Accounts.onLogout(() => {
	FlowRouter.go('/signin');
});

const app = FlowRouter.group({
	name: 'app',
	triggersEnter: [(context, redirect) => {
		if(Meteor.user()) {
			FlowRouter.go('/');
		} else {
			FlowRouter.go('/signin');
		}
	}]
});

app.route('/', {
	name: 'Home',
	action() {
		mount(AppContainer);
	},
});

app.route('/signin', {
	name: 'SignIn',
	action() {
		mount(LoginContainer);
	},
});

app.route('/signup', {
	name: 'SignUp',
	action() {
		mount(SignUpContainer);
	}
});