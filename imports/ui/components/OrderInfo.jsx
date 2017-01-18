import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { orderSubsManager } from '../../lib/subsManager';
import Menu from '../../api/menu/collection';
import Order from '../../api/orders/collection';

const propTypes = {
  items: PropTypes.arrayOf(Object),
  mapOfItemCounter: PropTypes.instanceOf(Map),
  menuLoading: PropTypes.bool,
  total: PropTypes.number,
};

const defaultProps = {
  items: [],
  mapOfItemCounter: [],
  total: 0,
};

const OrderInfo = (props) => {
  if (props.menuLoading) {
    return <div>Order loading...</div>;
  }

  return (<div>
    <div className="mdl-grid">
      <table className="m-auto mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <td>Name</td>
            <td>Description</td>
            <td>Mass</td>
            <td>Price</td>
            <td>Count</td>
          </tr>
        </thead>
        <tbody>
          { props.items.map(({ _id: id, ...itemInfo }) => (<tr key={id}>
            <td className="mdl-data-table__cell--non-numeric">{ itemInfo.name }</td>
            <td className="mdl-data-table__cell--non-numeric">{ itemInfo.description }</td>
            <td className="menu__mass">{ itemInfo.mass }</td>
            <td className="menu__price">{ itemInfo.price }</td>
            <td>
              { props.mapOfItemCounter.get(id) }
            </td>
          </tr>)) }
        </tbody>
      </table>
    </div>
    <h5 className="ta-c">Total price:{ props.total }</h5>
  </div>);
};

const OrderInfoContainer = createContainer(({ id }) => {
  Meteor.subscribe('Order', id);
  const handleMenu = orderSubsManager.subscribe('OrderMenu', id);

  const order = Order.findOne({ _id: id }) || {};
  const mapOfItemCounter = new Map();

  _.map(order.menu, ({ _id: itemId, count }) => { mapOfItemCounter.set(itemId, count); });

  return {
    total: order.totalPrice,
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
