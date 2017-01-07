import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import MenuListItem from '../../ui/components/MenuListItem';
import Menu from '../../api/menu/collection';
import Order from '../../api/orders/collection';

const propTypes = {
  items: PropTypes.arrayOf(Object),
  mapOfItemCounter: PropTypes.instanceOf(Map),
  menuLoading: PropTypes.bool,
};

const defaultProps = {
  items: [],
  mapOfItemCounter: [],
};

const OrderInfo = ({ items, menuLoading, mapOfItemCounter }) => {
  if (menuLoading) {
    return <div>Order loading...</div>;
  }

  return (<ul className="menu">
    { items.map(({ _id: id, ...itemInfo }) => (
      <li className="menu__item" key={id}>
        <MenuListItem
          name={itemInfo.name}
          description={itemInfo.description}
          mass={itemInfo.mass}
          price={itemInfo.price}
        />
        <span>
          { mapOfItemCounter.get(id) }
        </span>
      </li>
    )) }
  </ul>);
};

const OrderInfoContainer = createContainer(({ id }) => {
  Meteor.subscribe('Order', id);
  const handleMenu = Meteor.subscribe('OrderMenu', id);

  const order = Order.findOne({ _id: id }) || {};
  const mapOfItemCounter = new Map();

  _.map(order.menu, ({ _id: itemId, count }) => { mapOfItemCounter.set(itemId, count); });

  return {
    mapOfItemCounter,
    items: Menu.find().fetch(),
    menuLoading: !handleMenu.ready(),
  };
}, OrderInfo);

OrderInfo.propTypes = propTypes;
OrderInfo.defaultProps = defaultProps;

export default OrderInfo;
export {
  OrderInfoContainer,
};
