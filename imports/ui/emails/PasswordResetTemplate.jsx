import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Oy, { Table, TBody, TR, TD, A, Img } from 'oy-vey';
import { linkStyle, headerText } from './styles/emailStyles';

const propTypes = {
  user: PropTypes.string,
  link: PropTypes.string,
};

const PasswordResetTemplate = ({ user, link }) =>
  <Table align="left">
    <TBody>
      <TR>
        <TD>
          <span style={headerText}>Hello { user }</span>
        </TD>
      </TR>
      <TR>
        <TD>
          <A href={link} style={linkStyle}>Reset password link</A>
        </TD>
      </TR>
      <TR>
        <TD>
          <Img
            src={FlowRouter.url('/:image', { image: '/images/logo.png' })}
            height={100}
            width={100}
            align="center"
            alt="Pizza-day logo"
          />
        </TD>
      </TR>
    </TBody>
  </Table>;

PasswordResetTemplate.propTypes = propTypes;

const passwordResetEmail = (user, link) =>
  Oy.renderTemplate(<PasswordResetTemplate user={user.profile.name} link={link} />, {
    title: 'Pizza-day',
    previewText: 'Reset password of Pizza-day',
  });

export default passwordResetEmail;
