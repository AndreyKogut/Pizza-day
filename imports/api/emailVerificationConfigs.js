import { Accounts } from 'meteor/accounts-base';
import verificationEmail from '../ui/emails/EmailVerificationTemplate';

Accounts.from = 'Pizza-day';

Accounts.emailTemplates.verifyEmail.html = verificationEmail;
