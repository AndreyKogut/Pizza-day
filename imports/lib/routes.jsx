import {AccountsTemplates} from 'meteor/useraccounts:core';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Accounts} from 'meteor/accounts-base';
import {mount} from 'react-mounter';
import {UserCabinetContainer} from '../ui/UserCabinet';
import {AppContainer} from '../ui/App';
import {SignUp} from '../ui/SignUp';
import Login from '../ui/Login';

Accounts.onLogin(() => {
	const current = FlowRouter.current().path;


	if (current == '/signin' || current == '/signup') {
		FlowRouter.go('/');
	}
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
	action({id}) {

		mount(AppContainer, {
			content: <UserCabinetContainer id={id}/>
		});
	}
});

app.route('/signin', {
	name: 'SignIn',
	action() {
		mount(AppContainer, {
			content: <Login/>
		});
	},
});

app.route('/signup', {
	name: 'SignUp',
	action() {
		mount(AppContainer, {
			content: <SignUp/>
		});
	},
});
