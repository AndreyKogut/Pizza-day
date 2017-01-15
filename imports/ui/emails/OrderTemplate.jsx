import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Box, Email, Item, Span, Image, renderEmail } from 'react-html-email';

const propTypes = {
  userName: PropTypes.string,
  eventName: PropTypes.string,
  eventDate: PropTypes.string,
  totalPrice: PropTypes.number,
  items: PropTypes.arrayOf(Object),
};

const OrderTemplate = (props) => {
  const getListItems = () =>
    props.items.map(item => (<Item>
      <Item>
        { item.name }
      </Item>
      <Item>
        { item.price }
      </Item>
      <Item>
        { item.count }
      </Item>
    </Item>));

  return (<Email title="Reset password">
    <Box>
      <Item>
        <Span>Hello { props.userName } !</Span>
      </Item>
      <Item>
        <Span> Event { `"${props.eventName}"` } was ordered.</Span>
      </Item>
      <Item>
        <Span> Here is Your order.</Span>
      </Item>
      <Item>
        <Item>Name</Item>
        <Item>Price</Item>
        <Item>Count</Item>
      </Item>
      { getListItems() }
      <Item>
        <Span>Total price: { props.totalPrice }</Span>
      </Item>
      <Item>
        <Span> Event date: { props.eventDate }</Span>
      </Item>
      <Item>
        <Item />
        <Item>
          <Image
            src={FlowRouter.url('/:image', { image: '/images/logo.png' })}
            height={100}
            width={100}
            alt="Pizza-day logo"
          />
        </Item>
        <Item />
      </Item>
    </Box>
  </Email>);
};

OrderTemplate.propTypes = propTypes;

const orderEmail = props =>
  renderEmail(<OrderTemplate
    userName={props.userName}
    eventName={props.eventName}
    eventDate={props.eventDate}
    totalPrice={props.totalPrice}
    items={props.items}
  />);

export default orderEmail;
