import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Box, Email, Item, Span, A, Image, renderEmail } from 'react-html-email';

const propTypes = {
  user: PropTypes.string,
  link: PropTypes.string,
};

const EmailVerificationTemplate = ({ user, link }) =>
  <Email title="Hello world">
    <Box>
      <Item>
        <Item>
          <Item>
            <Span>Hello</Span>
          </Item>
          <Item>
            <Span>{ user }</Span>
          </Item>
        </Item>
        <Item>
          <A href={link}>Verify</A>
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

EmailVerificationTemplate.propTypes = propTypes;

const verificationEmail = (user, link) =>
  renderEmail(<EmailVerificationTemplate user={user.profile.name} link={link} />);

export default verificationEmail;
