import { Accounts } from 'meteor/accounts-base';
import verificationEmail from '../ui/emails/EmailVerificationTemplate';
import passwordResetEmail from '../ui/emails/PasswordResetTemplate';


Accounts.emailTemplates.from = 'an_ko_ol@meta.ua';

Accounts.emailTemplates.verifyEmail.html = verificationEmail;
Accounts.emailTemplates.verifyEmail.subject = () => 'Email verification for Pizza day';
Accounts.emailTemplates.resetPassword.html = passwordResetEmail;
Accounts.emailTemplates.resetPassword.subject = () => 'Reset password for Pizza day';
