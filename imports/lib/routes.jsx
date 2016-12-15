import {AccountsTemplates} from 'meteor/useraccounts:core';
import {FlowRouter} from 'meteor/kadira:flow-router';

import {Accounts} from 'meteor/accounts-base';

import {mount} from 'react-mounter';

import {AppContainer} from '../ui/App';
import Login from '../ui/Login';
import {SignUpContainer} from '../ui/SignUp';
import {UserCabinetContainer} from '../ui/UserCabinet';

Accounts.onLogin(() => {
	FlowRouter.go('/');
});

Accounts.onLogout(() => {
	FlowRouter.go('/signin');
});

const app = FlowRouter.group({
	name: 'app',
	triggersEnter: [(context, redirect) => {
	/*	if (Meteor.user()) {
			FlowRouter.go('/');
		} else {
			FlowRouter.go('/signin');
		}*/
	}]
});

app.route('/', {
	name: 'Home',
	action() {
		mount(AppContainer);
	},
});

app.route('/user/:id', {
	name: 'Cabinet',
	action(props) {
		mount(UserCabinetContainer, {
			id: props.id
		});
	}
});

app.route('/signin', {
	name: 'SignIn',
	action() {
		mount(Login);
	},
});

app.route('/signup', {
	name: 'SignUp',
	action() {
		mount(SignUpContainer);
	},
});
