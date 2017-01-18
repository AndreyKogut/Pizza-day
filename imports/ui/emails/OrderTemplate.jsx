import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Oy, { Table, TBody, TR, TD, Img } from 'oy-vey';
import moment from 'moment';
import { headerText, tableText, tableHeader, regularText, tableStyle } from './styles/emailStyles';

const propTypes = {
  userName: PropTypes.string,
  eventName: PropTypes.string,
  eventDate: PropTypes.string,
  totalPrice: PropTypes.number,
  items: PropTypes.arrayOf(Object),
};

const OrderTemplate = (props) => {
  const formattedDate = moment(props.eventDate).format('LLL');

  const getListItems = () =>
    props.items.map(item => (<TR key={item._id} style={tableText}>
      <TD>
        { item.name }
      </TD>
      <TD>
        { item.price }
      </TD>
      <TD>
        { item.count }
      </TD>
    </TR>));

  return (<Table align="left">
    <TBody>
      <TR>
        <TD>
          <span style={headerText}>Hello { props.userName } !</span>
        </TD>
      </TR>
      <TR>
        <TD>
          <span style={regularText}>Event { `"${props.eventName}"` } was ordered.</span>
        </TD>
      </TR>
      <TR>
        <TD>
          <span style={regularText}>Here is Your order.</span>
        </TD>
      </TR>
      <TR>
        <TD>
          <Table align="center" cellSpacing={20} style={tableStyle}>
            <TR style={tableHeader}>
              <TD>Name</TD>
              <TD>Price</TD>
              <TD>Count</TD>
            </TR>
            { getListItems() }
          </Table>
        </TD>
      </TR>
      <TR>
        <TD align="center">
          <span style={regularText}>Total price: { props.totalPrice }</span>
        </TD>
      </TR>
      <TR>
        <TD>
          <span style={regularText}>Event date: { formattedDate }</span>
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
  </Table>);
};

OrderTemplate.propTypes = propTypes;

const orderEmail = props =>
  Oy.renderTemplate(<OrderTemplate
    {...props}
  />, {
    title: 'Your order',
    previewText: 'Get order',
  });

export default orderEmail;
