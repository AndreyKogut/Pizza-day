import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import verificationEmail from '../ui/emails/EmailVerificationTemplate';
import passwordResetEmail from '../ui/emails/PasswordResetTemplate';

Accounts.emailTemplates = {
  from: Meteor.settings.from,
  verifyEmail: {
    html: verificationEmail,
    subject: () => 'Email verification for Pizza day',
  },
  resetPassword: {
    html: passwordResetEmail,
    subject: () => 'Reset password for Pizza day',
  },
};
