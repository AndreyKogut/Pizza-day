import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Oy, { Table, TBody, TR, TD, A, Img } from 'oy-vey';

const propTypes = {
  user: PropTypes.string,
  link: PropTypes.string,
};

const EmailVerificationTemplate = ({ user, link }) =>
  <Table>
    <TBody>
      <TR>
        <TD>
          <span>Hello { user }</span>
        </TD>
        <TD>
          <A href={link}>Verify</A> Your email address.
        </TD>
      </TR>
      <TR>
        <TD />
        <Img
          src={FlowRouter.url('/:image', { image: '/images/logo.png' })}
          height={100}
          width={100}
          alt="Pizza-day logo"
        />
        <TD />
      </TR>
    </TBody>
  </Table>;

EmailVerificationTemplate.propTypes = propTypes;

const verificationEmail = (user, link) =>
  Oy.renderTemplate(<EmailVerificationTemplate
    user={user.profile.name}
    link={link}
  />, {
    title: 'Pizza-day',
    previewText: 'Email verification',
  });

export default verificationEmail;
