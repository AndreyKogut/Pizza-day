import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Oy, { Table, TBody, TR, TD, A, Img } from 'oy-vey';
import { linkStyle, headerText } from './styles/emailStyles';


const propTypes = {
  user: PropTypes.string,
  link: PropTypes.string,
};

const EmailVerificationTemplate = ({ user, link }) =>
  <Table align="left">
    <TBody>
      <TR>
        <TD>
          <span style={headerText}>Hello { user }</span>
        </TD>
        <TD>
          <A href={link} style={linkStyle}>Verify Your email address.</A>
        </TD>
      </TR>
      <TR>
        <TD align="center">
          <Img
            src={FlowRouter.url('/:image', { image: '/images/logo.png' })}
            height={100}
            width={100}
            alt="Pizza-day logo"
          />
        </TD>
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
