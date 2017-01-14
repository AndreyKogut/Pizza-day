import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Box, Email, Item, Span, A, Image, renderEmail } from 'react-html-email';

const propTypes = {
  user: PropTypes.string,
  link: PropTypes.string,
};

const PasswordResetTemplate = ({ user, link }) =>
  <Email title="Reset password">
    <Box>
      <Item>
        <Item>
          <Span>Hello</Span>
        </Item>
        <Item>
          <Span>{ user }</Span>
        </Item>
      </Item>
      <Item>
        <Span>Reset password link</Span>
      </Item>
      <Item>
        <Item>
          <A href={link}>Reset</A>
        </Item>
      </Item>
      <Item>
        <Item />
        <Image
          src={FlowRouter.url('/:image', { image: '/images/logo.png' })}
          height={100}
          width={100}
          alt="Pizza-day logo"
        />
        <Item />
      </Item>
    </Box>
  </Email>;

PasswordResetTemplate.propTypes = propTypes;

const passwordResetEmail = (user, link) =>
  renderEmail(<PasswordResetTemplate user={user.profile.name} link={link} />);

export default passwordResetEmail;
