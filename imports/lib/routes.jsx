import {AccountsTemplates} from 'meteor/useraccounts:core';
import {FlowRouter} from 'meteor/kadira:flow-router';

import {Accounts} from 'meteor/accounts-base';

import {mount} from 'react-mounter';

import {AppContainer} from '../ui/App';
import {LoginContainer} from '../ui/Login';
import {SignUpContainer} from '../ui/SignUp';

Accounts.onLogin(()=> {
	FlowRouter.go('Home');
});

FlowRouter.route('/', {
	name: 'Home',
	action(props) {
		mount(AppContainer);
	},
});

FlowRouter.route('/login', {
	name: 'Login',
	action(props) {
		mount(LoginContainer);
	},
});

FlowRouter.route('/signup', {
	name: 'SignUp',
	action(props) {
		mount(SignUpContainer);
	}
});