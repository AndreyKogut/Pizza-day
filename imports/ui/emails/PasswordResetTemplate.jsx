import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Oy, { Table, TBody, TR, TD, A, Img } from 'oy-vey';

const propTypes = {
  user: PropTypes.string,
  link: PropTypes.string,
};

const PasswordResetTemplate = ({ user, link }) =>
  <Table>
    <TBody>
      <TR>
        <TD>
          <span>Hello { user }</span>
        </TD>
      </TR>
      <TR>
        <TD>
          <span>Reset password link</span>
        </TD>
      </TR>
      <TR>
        <TD>
          <A href={link}>Reset</A>
        </TD>
      </TR>
      <TR>
        <Img
          src={FlowRouter.url('/:image', { image: '/images/logo.png' })}
          height={100}
          width={100}
          align="center"
          alt="Pizza-day logo"
        />
      </TR>
    </TBody>
  </Table>;

PasswordResetTemplate.propTypes = propTypes;

const passwordResetEmail = (user, link) =>
  Oy.renderTemplate(<PasswordResetTemplate user={user.profile.name} link={link} />, {
    title: 'Pizza-day',
    previewText: 'Reset password',
  });

export default passwordResetEmail;
