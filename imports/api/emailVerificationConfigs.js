import { Accounts } from 'meteor/accounts-base';
import verificationEmail from '../ui/emails/EmailVerificationTemplate';
import passwordResetEmail from '../ui/emails/PasswordResetTemplate';

Accounts.emailTemplates.verifyEmail.html = verificationEmail;
Accounts.emailTemplates.resetPassword.html = passwordResetEmail;
